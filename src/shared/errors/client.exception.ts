import { HttpException, HttpStatus, Logger } from '@nestjs/common'

import { BaseError } from './base.error'
import { ErrorTypes } from './enums'

/**
 * Represents a client exception with detailed logging capabilities.
 */
export class ClientException extends HttpException implements BaseError {
  private logger = new Logger(this.constructor.name)

  public readonly type: ErrorTypes
  public readonly errorCode: string
  public readonly statusCode: number
  public readonly stack: string
  public readonly exception: unknown
  public readonly context: Record<string, unknown>
  public readonly details?: string
  public readonly extra?: Record<string, unknown>

  constructor(
    message: string,
    details: string,
    statusCode: HttpStatus,
    errorCode: string,
    context: Record<string, unknown>,
    exception: unknown,
    stack?: string,
    extra?: Record<string, unknown>
  ) {
    super(message, statusCode)
    this.details = details
    this.statusCode = statusCode
    this.type = ErrorTypes.CLIENT_ERROR
    this.errorCode = errorCode
    this.context = context
    this.stack = stack
    this.exception = exception
    this.extra = extra

    Error.captureStackTrace(this, this.constructor)
  }

  logError(extraParam?: unknown): void {
    this.logger.error(
      `${this.statusCode} ${this.message} - ${this.details} - ${extraParam}`,
      this.extra
    )
  }
}
