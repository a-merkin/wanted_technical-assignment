export type LevelType = 'FATAL' | 'ERROR' | 'DEBUG' | 'INFO' | 'TRACE'

export interface LogItem {
  Timestamp: string
  Level: LevelType
  Message: string
  Source: string
}

export interface LogList {
  Action: 0 | 3
  Items: LogItem[]
}