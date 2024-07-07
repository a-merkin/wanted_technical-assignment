import axios, { AxiosInstance, AxiosRequestConfig, HeadersDefaults, ResponseType, AxiosResponseHeaders } from "axios";

type ApiConfig<SecurityDataType> = {
  securityWorker?: (data: SecurityDataType | null) => Promise<AxiosRequestConfig | void>;
  secure?: boolean;
  format?: ResponseType;
  baseURL?: string;
  axiosConfig?: Omit<AxiosRequestConfig, 'baseURL'>;
};

type QueryParam = string | number | boolean | string[] | number[] | boolean[];

type FullRequestParams = AxiosRequestConfig & {
  secure?: boolean;
  path: string;
  type?: ContentType;
  query?: Record<string, QueryParam>;
  format?: ResponseType;
  body?: unknown;
};

export enum ContentType {
  JSON = "application/json",
  FormData = "multipart/form-data",
  Text = "text/plain",
}

type SuccessResponse<T> = { success: true; data: T };
type ErrorResponse<E> = { success: false; error: E };
export type ApiResponse<T, E> = SuccessResponse<T> | ErrorResponse<E>;
export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: (data: SecurityDataType | null) => Promise<AxiosRequestConfig | void>;
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, baseURL, axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: import.meta.env['VITE_API_URL'] || baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method?.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown): string {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: unknown[] = Array.isArray(property) ? property : [property];
      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }
      return formData;
    }, new FormData());
  }

  public request = async <T, E = unknown>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<ApiResponse<T, E>> => {
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

    try {
      const response = await this.instance.request<T>({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("HTTP Request Error:", error);
      throw error
    }
  };
}
