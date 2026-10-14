/** Stable contracts for the NUDL IDE API layer. These types do not imply a server exists. */
export type ApiStatus = 'ok' | 'error';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

export interface ApiResult<T> {
  status: ApiStatus;
  data?: T;
  error?: ApiError;
  requestId?: string;
}

export interface HealthResponse {
  service: string;
  version: string;
  status: 'healthy' | 'degraded';
  timestamp: string;
  capabilities: string[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  updatedAt: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  path: string;
  content: string;
  revision: number;
  updatedAt: string;
}

export interface CompileRequest {
  source: string;
  target: string;
  fileName?: string;
}

export interface CompileResponse {
  target: string;
  fileName: string;
  source: string;
  diagnostics: Array<{
    code: string;
    message: string;
    line: number;
    column: number;
    severity: 'error' | 'warning' | 'info';
  }>;
}
