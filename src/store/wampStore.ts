import { defineStore } from 'pinia';
import wampService from '../websocket/wampService';
import type { AuthorizationParams, AuthorizationResponse } from '../types/auth';
import type { LogItem, LogList } from '../types/logs'

interface wampState {
  websocket: typeof wampService | null,
  isWsConnected: Boolean,
  logs: LogItem[]
}

export const useWampStore = defineStore('wamp', {
  state: (): wampState => ({
    websocket: null,
    isWsConnected: false,
    logs: []
  }),
  actions: {
    connect() {
      this.websocket = wampService 
      return this.websocket.connect().then(() => {
        this.isWsConnected = true
      })
    },
    auth(authParams: AuthorizationParams): Promise<AuthorizationResponse> | undefined {
      return this.websocket?.call('/login', authParams)
    },
    authToken(): Promise<AuthorizationResponse> | undefined {
      return this.websocket?.call('/loginByToken', localStorage.getItem('token'))
    },
    subscribeToLogs() {
      this.websocket?.subscribe('/subscription/logs/list', (response) => {
        const { Items } = response as LogList
        this.logs.push(...Items)
      })
    },
    startHeartbeat() {
      this.websocket?.startHeartbeat(30000)
    }
  },
});