import axios, { AxiosInstance, AxiosRequestConfig, HeadersDefaults, ResponseType } from "axios";

type ApiConfig<SecurityDataType> = {
  securityWorker?: (data: SecurityDataType | null) => Promise<AxiosRequestConfig | void>;
  secure?: boolean;
  format?: ResponseType;
  baseURL?: string;
};

type FullRequestParams = AxiosRequestConfig & {
  secure?: boolean;
  path: string;
  type?: ContentType;
  query?: Record<string, string | number | boolean | string[] | number[] | boolean[]>;
  format?: ResponseType;
  body?: unknown;
};

enum ContentType {
  JSON = "application/json",
  FormData = "multipart/form-data",
  Text = "text/plain",
}

/**
 * Класс HttpClient предоставляет методы для выполнения HTTP-запросов.
 * @template SecurityDataType Тип данных безопасности
 */
export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  /**
   * Конструктор класса HttpClient.
   * @param {ApiConfig<SecurityDataType>} [config] - Конфигурация клиента
   */
  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  /**
   * Устанавливает данные безопасности.
   * @param {SecurityDataType | null} data - Данные безопасности
   */
  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  /**
   * Объединяет параметры запросов.
   * @param {AxiosRequestConfig} params1 - Первые параметры запроса
   * @param {AxiosRequestConfig} [params2] - Вторые параметры запроса
   * @returns {AxiosRequestConfig} Объединенные параметры запроса
   */
  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  /**
   * Преобразует элемент формы в строку, если это необходимо.
   * @param {unknown} formItem - Элемент формы
   * @returns {string} Преобразованный элемент формы
   */
  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  /**
   * Создает объект FormData из заданного ввода.
   * @param {Record<string, unknown>} input - Входные данные
   * @returns {FormData} Объект FormData
   */
  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: unknown[] = property instanceof Array ? property : [property];
      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }
      return formData;
    }, new FormData());
  }

  /**
   * Выполняет HTTP-запрос и обрабатывает ошибки.
   * @template T Тип данных успешного ответа
   * @template E Тип данных ошибки
   * @param {FullRequestParams} params - Параметры запроса
   * @returns {Promise<T>} Промис, который разрешается с данными ответа
   * @throws {E} Ошибка, возникшая при выполнении запроса
   */
  public request = async <T, _E = unknown>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;
    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }
    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }
    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}
