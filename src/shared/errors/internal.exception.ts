import { Logger } from '@nestjs/common'

import { BaseError } from './base.error'
import { ErrorTypes } from './enums'

/**
 * Represents an internal exception with detailed logging capabilities.
 */
export class InternalException extends BaseError {
  private logger = new Logger(this.constructor.name)

  constructor(
    message: string,
    errorCode: string,
    exception: unknown,
    stack: string,
    context: Record<string, unknown>,
    details?: string,
    extra?: Record<string, unknown>
  ) {
    super(
      message,
      ErrorTypes.INTERNAL_ERROR,
      errorCode,
      exception,
      stack,
      details,
      extra
    )
    this.context = context
  }

  logError(): void {
    this.logger.error(
      `[InternalError] ${this.message}`,
      this.errorCode,
      this.stack,
      this.context,
      this.details,
      this.extra
    )
  }
}
