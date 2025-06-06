import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { databaseProviders } from './database.provider'

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule implements OnModuleInit {
  private logger = new Logger(this.constructor.name)

  constructor(private configService: ConfigService) {}

  onModuleInit(): void {
    const dbDriver = this.configService.get('db.driver')
    let message =
      dbDriver === 'sqlite'
        ? `Database driver: ${dbDriver} with file ${this.configService.get('db.sqlite.database')}`
        : `Database driver: ${dbDriver}`

    this.logger.log(message)
  }
}
