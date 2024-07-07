type WAMPMessage = [number, ...unknown[]];

interface CallResult<T> {
  result: T;
}

interface CallError {
  error: true;
  uri: string;
  description: string;
  details: unknown;
}

type WAMPResponse<T> = CallResult<T> | CallError;

/**
 * Класс WAMPClient для работы с протоколом WAMP поверх WebSocket.
 */
export class WAMPClient {
  private socket: WebSocket | null = null;
  private sessionId: string | null = null;
  private callIdCounter: number = 0;
  private heartbeatCounter: number = 0;
  private pendingCalls: Map<string, (response: WAMPResponse<unknown>) => void> = new Map();
  private subscriptions: Map<string, (event: unknown) => void> = new Map();

  /**
   * Создает экземпляр WAMPClient.
   * @param url - URL сервера WebSocket.
   */
  constructor(private url: string) {}

  /**
   * Генерирует уникальный идентификатор вызова.
   * @returns Уникальный идентификатор вызова.
   */
  private generateCallId(): string {
    return (this.callIdCounter++).toString(36).padStart(16, '0');
  }

  /**
   * Обрабатывает входящие сообщения WebSocket.
   * @param event - Событие сообщения WebSocket.
   */
  private onMessage(event: MessageEvent) {
    const message: WAMPMessage = JSON.parse(event.data);
    const [type, ...args] = message;

    switch (type) {
      case 0:
        this.sessionId = args[0] as string;
        console.log('Connected to server with session ID:', this.sessionId);
        break;
      case 3:
        const [callId, result] = args;
        if (this.pendingCalls.has(callId as string)) {
          this.pendingCalls.get(callId as string)!({ result });
          this.pendingCalls.delete(callId as string);
        }
        break;
      case 4:
        const [errorCallId, errorUri, errorDesc, errorDetails] = args;
        if (this.pendingCalls.has(errorCallId as string)) {
          this.pendingCalls.get(errorCallId as string)!({
            error: true,
            uri: errorUri as string,
            description: errorDesc as string,
            details: errorDetails,
          });
          this.pendingCalls.delete(errorCallId as string);
        }
        break;
      case 8:
        const [eventUri, event] = args;
        if (this.subscriptions.has(eventUri as string)) {
          this.subscriptions.get(eventUri as string)!(event);
        }
        break;
      case 20:
        console.log('Heartbeat response received:', args[0]);
        break;
      default:
        console.warn('Unknown message type received:', type);
    }
  }

  /**
   * Устанавливает соединение с сервером WebSocket.
   */
  public connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = this.onMessage.bind(this);

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.sessionId = null;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  /**
   * Закрывает соединение с сервером WebSocket.
   */
  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Выполняет вызов WAMP.
   * @param uri - URI выполняемого метода.
   * @param args - Аргументы метода.
   * @returns Промис, который разрешается с результатом вызова.
   */
  public call<T>(uri: string, ...args: unknown[]): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        return reject('WebSocket is not connected');
      }

      const callId = this.generateCallId();
      this.pendingCalls.set(callId, (response) => {
        if ('error' in response) {
          reject(response);
        } else {
          resolve(response.result as T);
        }
      });

      const message: WAMPMessage = [2, callId, uri, ...args];
      this.socket.send(JSON.stringify(message));
    });
  }

  /**
   * Подписывается на события WAMP.
   * @param uri - URI подписки.
   * @param callback - Функция обратного вызова для обработки событий.
   */
  public subscribe(uri: string, callback: (event: unknown) => void) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.subscriptions.set(uri, callback);
    const message: WAMPMessage = [5, uri];
    this.socket.send(JSON.stringify(message));
  }

  /**
   * Отписывается от событий WAMP.
   * @param uri - URI подписки.
   */
  public unsubscribe(uri: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    if (this.subscriptions.has(uri)) {
      this.subscriptions.delete(uri);
    }
    const message: WAMPMessage = [6, uri];
    this.socket.send(JSON.stringify(message));
  }

  /**
   * Отправляет heartbeat-сообщение для поддержания соединения.
   */
  public sendHeartbeat() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const message: WAMPMessage = [20, this.heartbeatCounter++];
    this.socket.send(JSON.stringify(message));
  }

   /**
   * Начинает отправку heartbeat-сообщений через заданный интервал.
   * @param interval - Интервал отправки heartbeat-сообщений в миллисекундах.
   */
  public startHeartbeat(interval: number = 30000) {
    setInterval(() => {
      this.sendHeartbeat();
    }, interval);
  }
}
