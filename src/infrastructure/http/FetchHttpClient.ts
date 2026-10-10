import { HttpClient, RequestOptions, ApiException } from './HttpClient';
import { ApiErrorDetail } from './dto/api.dto';

export class FetchHttpClient implements HttpClient {
  private token: string | null = null;
  private tokenProvider: () => string | null = () => null;
  private unauthorizedHandler: () => void = () => {};

  public constructor() {
    this.token = this.getStoredToken();
  }

  public setToken(token: string | null): void {
    this.token = token;
  }

  public setTokenProvider(provider: () => string | null): void {
    this.tokenProvider = provider;
  }

  public setUnauthorizedHandler(handler: () => void): void {
    this.unauthorizedHandler = handler;
  }

  private getStoredToken(): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const directToken = window.localStorage.getItem('stockflow_access_token');
        if (directToken) return directToken;

        const stored = window.localStorage.getItem('stockflow_auth_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.accessToken || null;
        }
      }
    } catch {
      // ignore storage errors
    }
    return null;
  }

  private buildUrl(url: string, params?: Record<string, string | number | boolean | undefined>): string {
    if (!params) return url;
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    }
    const queryString = query.toString();
    return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
  }

  private getHeaders(customHeaders?: Record<string, string>, isJson: boolean = true): Headers {
    const headers = new Headers();
    if (isJson) {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
    } else {
      headers.set('Accept', 'application/json');
    }

    const token = this.token ?? this.tokenProvider() ?? this.getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Correlation ID
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      headers.set('X-Request-Id', crypto.randomUUID());
    }

    if (customHeaders) {
      for (const [k, v] of Object.entries(customHeaders)) {
        headers.set(k, v);
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response, url?: string): Promise<T> {
    if (response.status === 401) {
      const isLoginRequest = url ? url.includes('/api/auth/login') : false;
      if (!isLoginRequest) {
        this.token = null;
        this.unauthorizedHandler();
      }
      throw new ApiException(401, undefined, 'No autorizado. La sesión ha expirado o el token es inválido.');
    }

    if (response.status === 403) {
      throw new ApiException(403, undefined, 'Acceso prohibido. No tienes permisos para esta acción.');
    }

    if (response.status === 404) {
      throw new ApiException(404, undefined, 'Recurso no encontrado.');
    }

    if (response.status === 405) {
      throw new ApiException(405, undefined, 'Método HTTP no permitido.');
    }

    if (!response.ok) {
      let errorDetail: ApiErrorDetail | undefined;
      try {
        errorDetail = (await response.json()) as ApiErrorDetail;
      } catch {
        // Response was not JSON
      }

      throw new ApiException(response.status, errorDetail);
    }

    // 204 No Content
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  }

  public async get<T>(url: string, options?: RequestOptions): Promise<T> {
    const fullUrl = this.buildUrl(url, options?.params);
    const headers = this.getHeaders(options?.headers, false);
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<T>(response, fullUrl);
  }

  public async post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const fullUrl = this.buildUrl(url, options?.params);
    const headers = this.getHeaders(options?.headers, true);
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response, fullUrl);
  }

  public async put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const fullUrl = this.buildUrl(url, options?.params);
    const headers = this.getHeaders(options?.headers, true);
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response, fullUrl);
  }

  public async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    const fullUrl = this.buildUrl(url, options?.params);
    const headers = this.getHeaders(options?.headers, false);
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<T>(response, fullUrl);
  }

  public async upload<T>(url: string, file: File, options?: RequestOptions): Promise<T> {
    const fullUrl = this.buildUrl(url, options?.params);
    const headers = this.getHeaders(options?.headers, false);
    // Remove Content-Type so browser sets multipart boundary automatically
    headers.delete('Content-Type');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: formData,
    });
    return this.handleResponse<T>(response, fullUrl);
  }
}

export const httpClient = new FetchHttpClient();
