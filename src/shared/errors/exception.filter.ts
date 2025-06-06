import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Request, Response } from 'express'

import { ErrorResponse } from './error.interface'
import { ErrorService } from './error.service'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly errorService: ErrorService) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const clientException = await this.errorService.handleException(exception)

    clientException.logError(request.ip)

    const errorResponse: ErrorResponse = {
      path: request.url,
      statusCode: clientException.getStatus(),
      message: clientException.message || 'Internal server error',
      details: clientException.details || '',
      timestamp: new Date().toISOString()
    }

    response.status(clientException.getStatus()).json(errorResponse)
  }
}
