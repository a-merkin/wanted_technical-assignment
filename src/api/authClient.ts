import { HttpClient, RequestParams } from './httpClient';

export class AuthClient<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  login = (
      query: {
        username: string,
        password: string
      },
      params: RequestParams = {}
  ) =>
    this.request<any, any>({
      path: '/login',
      method: "POST",
      secure: true,
      format: "json",
      query: query,
      ...params,
    });

  loginByToken = (
    query: {
      token: string
    },
    params: RequestParams = {}
  ) =>
    this.request<any, any>({
      path: '/loginByToken',
      method: "POST",
      query: query,
      format: "json",
      ...params,
    });
}