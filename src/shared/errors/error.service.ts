import { HttpException, Injectable } from '@nestjs/common'

import { ClientException } from './client.exception'
import { FormattedError } from './error.interface'
import { InternalException } from './internal.exception'

@Injectable()
export class ErrorService {
  private formatHttpException(error: HttpException): FormattedError {
    const status = error.getStatus()
    const exceptionResponse = error.getResponse()
    const errorResponse = exceptionResponse.valueOf() as Record<string, string>

    const formattedError: FormattedError = {
      message: errorResponse.error,
      details: (exceptionResponse as ClientException).message || error.message,
      status: status,
      errorCode: 'HTTP_EXCEPTION',
      exception: error,
      stack: error.stack,
      response: exceptionResponse
    }

    return formattedError
  }

  private formatInternalException(error: InternalException): FormattedError {
    const formattedError: FormattedError = {
      message: error.message,
      details: error.details,
      status: 500,
      errorCode: 'INTERNAL_EXCEPTION',
      exception: error,
      stack: error.stack,
      context: error.context
    }

    return formattedError
  }

  public async handleException(exception: unknown): Promise<ClientException> {
    if (exception instanceof ClientException) {
      return exception
    }

    let formattedError: FormattedError

    if (exception instanceof HttpException) {
      formattedError = this.formatHttpException(exception)
    } else if (exception instanceof InternalException) {
      formattedError = this.formatInternalException(exception)
    } else {
      formattedError = {
        message:
          (exception as ClientException).message || 'Unexpected error occurred',
        details: (exception as ClientException).details || '',
        status: 500,
        errorCode: 'UNKNOWN_ERROR',
        exception: exception,
        stack: (exception as ClientException).stack || '',
        context: {}
      }
    }

    return new ClientException(
      formattedError.message,
      formattedError.details,
      formattedError.status,
      formattedError.errorCode,
      formattedError.context,
      formattedError.exception,
      formattedError.stack
    )
  }
}
