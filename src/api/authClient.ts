import { HttpClient, RequestParams } from './httpClient';

export class AuthClient<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  login = (
      query: {
        login: string,
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

  loginByToken = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: '/loginByToken',
      method: "POST",
      format: "json",
      ...params,
    });
}