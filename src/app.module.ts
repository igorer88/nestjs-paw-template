import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import {
  apiConfig,
  cacheConfig,
  dbConfig,
  Environment,
  getValidationSchema,
  throttlerConfig
} from './config'
import { AppCacheModule } from './config/cache'
import { HealthCheckModule } from './config/health-check'
import { AppRateLimitingModule } from './config/rate-limiting'
import { DatabaseModule } from './database/database.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: getValidationSchema(),
      load: [apiConfig, cacheConfig, dbConfig, throttlerConfig],
      isGlobal: true,
      cache: true
    }),
    AppCacheModule,
    AppRateLimitingModule,
    SharedModule,
    HealthCheckModule,
    DatabaseModule
  ]
})
export class AppModule {
  static port: number
  static secretKey: string
  static environment: string
  static allowedOrigins: string[]

  constructor(private readonly configService: ConfigService) {
    AppModule.environment = this.configService.get('api.environment') as string
    AppModule.port = this.configService.get('api.port') as number
    AppModule.allowedOrigins =
      AppModule.environment === Environment.Production
        ? (this.configService.get('api.allowedOrigins') as string[])
        : ['*']
    AppModule.secretKey = this.configService.get('api.secretKey') as string
  }
}
