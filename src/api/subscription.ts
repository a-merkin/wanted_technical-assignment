import { HttpClient, ApiResponse, ContentType } from './httpClient';

export class Subscribtion<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  getLogsList = (): Promise<ApiResponse<void, unknown>> => {
    return this.request<void>({
      path: '/subscription/logs/list',
      method: 'GET',
      type: ContentType.JSON,
      format: 'json',
    });
  };
}
