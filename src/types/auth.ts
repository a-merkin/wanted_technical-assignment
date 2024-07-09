export interface AuthorizationParams {
  username: string
  password: string
}

export interface AuthorizationResponse {
  Token: string
  Username: string
}

export interface AuthorizationByTokenParams {
  token: string
}