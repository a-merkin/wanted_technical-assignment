export interface LogItem {
  Timestamp: string
  Level: 'FATAL' | 'ERROR' | 'DEBUG' | 'INFO' | 'TRACE'
  Message: string
  Source: string
}

export interface LogList {
  Action: 0 | 3
  Items: LogItem[]
}