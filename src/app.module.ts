import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { apiConfig, cacheConfig, dbConfig, getValidationSchema } from './config'
import { AppCacheModule } from './config/cache'
import { DatabaseModule } from './database/database.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: getValidationSchema(),
      load: [apiConfig, cacheConfig, dbConfig],
      isGlobal: true,
      cache: true
    }),
    AppCacheModule,
    SharedModule,
    DatabaseModule
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
