import type { ApiError, ApiResult, CompileRequest, CompileResponse, HealthResponse } from './types';

export interface ApiClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
  fetchImpl?: typeof fetch;
}

/** Small typed HTTP client. The API base URL and fetch implementation are configurable. */
export class NudlApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly headers: Record<string, string>;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? '/api').replace(/\/$/, '');
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.headers = options.headers ?? {};
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async health(): Promise<ApiResult<HealthResponse>> {
    return this.request<HealthResponse>('/health');
  }

  async compile(request: CompileRequest): Promise<ApiResult<CompileResponse>> {
    return this.request<CompileResponse>('/compile', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchImpl(this.baseUrl + path, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...this.headers,
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
          ...init.headers,
        },
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const apiError: ApiError =
          body && typeof body === 'object' && 'error' in body
            ? (body as { error: ApiError }).error
            : { code: 'HTTP_' + response.status, message: response.statusText || 'API request failed.' };
        return { status: 'error', error: apiError };
      }
      return { status: 'ok', data: body as T };
    } catch (error) {
      const message = error instanceof Error
        ? (error.name === 'AbortError' ? 'Request timed out.' : error.message)
        : 'Unknown API request failure.';
      return { status: 'error', error: { code: 'NETWORK_ERROR', message } };
    } finally {
      clearTimeout(timer);
    }
  }
}
