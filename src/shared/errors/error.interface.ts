export interface FormattedError {
  message: string
  exception: unknown
  errorCode: string
  details: string
  context?: Record<string, unknown>
  status?: number
  stack?: string
  response?: unknown
}

export interface ErrorResponse {
  path: string
  statusCode: number
  message: string
  details: string
  timestamp: string
}
