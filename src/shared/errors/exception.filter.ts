import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'

import { Environment } from '@/config'

import { ErrorResponse } from './error.interface'
import { ErrorService } from './error.service'
import { anonymizeIp } from '../utils.helper'

type IpLogLevel = 'enabled' | 'disabled' | 'anonymized'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly errorService: ErrorService,
    private readonly configService: ConfigService
  ) {}

  private getLoggableIp(ip: string | undefined): string | undefined {
    if (!ip) return undefined

    const logLevel = this.configService.get<string>(
      'api.ipLogLevel'
    ) as IpLogLevel

    switch (logLevel) {
      case 'disabled':
        return undefined
      case 'anonymized':
        return anonymizeIp(ip)
      case 'enabled':
      default:
        return ip
    }
  }

  private shouldExposeDetails(): boolean {
    const environment = this.configService.get<string>('api.environment')
    return environment !== Environment.Production
  }

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const clientException = await this.errorService.handleException(exception)

    const loggableIp = this.getLoggableIp(request.ip)
    clientException.logError(loggableIp)

    const showDetails = this.shouldExposeDetails()

    const errorResponse: ErrorResponse = {
      path: request.url,
      statusCode: clientException.getStatus(),
      message: clientException.message || 'Internal server error',
      details: showDetails
        ? clientException.details || ''
        : 'An error occurred',
      timestamp: new Date().toISOString()
    }

    response.status(clientException.getStatus()).json(errorResponse)
  }
}
