import { Module, Scope } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'

import { apiConfig, dbPgConfig, getValidationSchema } from './config'
import { ErrorService } from './config/errors/error.service'
import { AllExceptionsFilter } from './config/errors/exception.filter'
import { LoggingInterceptor } from './config/interceptors'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: getValidationSchema(),
      load: [apiConfig, dbPgConfig],
      isGlobal: true
    }),
    DatabaseModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    ErrorService
  ]
})
export class AppModule {
  static port: number
  static secretKey: string
  static environment: string

  constructor(private readonly configService: ConfigService) {
    AppModule.environment = this.configService.get('api.environment') as string
    AppModule.port = this.configService.get('api.port') as number
    AppModule.secretKey = this.configService.get('api.secretKey') as string
  }
}
