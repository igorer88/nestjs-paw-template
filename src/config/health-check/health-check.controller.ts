import { Controller, Get } from '@nestjs/common'

import { HealthCheckService } from './health-check.service'

@Controller('health')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get('db')
  async checkDatabaseConnection(): Promise<string> {
    const isConnected = await this.healthCheckService.isDatabaseConnected()
    if (!isConnected) {
      return 'Database is not connected'
    }

    return 'Database is connected'
  }
}
