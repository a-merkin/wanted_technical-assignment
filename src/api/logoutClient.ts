import { HttpClient, ApiResponse, ContentType } from './httpClient';

export class LogoutClient<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  logout = (): Promise<ApiResponse<void, unknown>> => {
    return this.request<void>({
      path: '/logout',
      method: 'POST',
      type: ContentType.JSON,
      format: 'json',
    });
  };
}
