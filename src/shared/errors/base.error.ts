import { ErrorTypes } from './enums'

/**
 * Abstract base class for custom errors with detailed logging capabilities.
 */
export abstract class BaseError extends Error {
  public context: Record<string, unknown>

  constructor(
    public readonly message: string,
    public readonly type: ErrorTypes,
    public readonly errorCode: string,
    public readonly exception: unknown,
    public readonly stack: string,
    public readonly details?: string,
    public readonly extra?: Record<string, unknown>
  ) {
    super(message)
    this.message = message
    this.name = this.constructor.name
    this.type = type
    this.errorCode = errorCode
    this.exception = exception
    this.stack = stack
    this.details = details
    this.extra = extra
    Error.captureStackTrace(this, this.constructor)
  }

  abstract logError(extraParam?: unknown): void
}
