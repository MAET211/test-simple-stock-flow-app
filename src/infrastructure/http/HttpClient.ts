import { ApiErrorDetail } from './dto/api.dto';

export class ApiException extends Error {
  public constructor(
    public readonly status: number,
    public readonly errorDetail?: ApiErrorDetail,
    message?: string
  ) {
    super(message || errorDetail?.detail || `Error HTTP ${status}`);
    this.name = 'ApiException';
  }

  public get fieldErrors(): Record<string, string[]> {
    return this.errorDetail?.errors || {};
  }
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface HttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<T>;
  post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(url: string, options?: RequestOptions): Promise<T>;
  upload<T>(url: string, file: File, options?: RequestOptions): Promise<T>;
}
