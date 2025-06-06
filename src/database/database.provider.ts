import { DynamicModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { Environment } from '@/config'

export const databaseProviders: DynamicModule[] = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
      const isProduction =
        configService.get<string>('api.environment') === Environment.Production

      const driver = configService.get<string>('db.driver')

      const commonOptions = {
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: !isProduction,
        autoLoadEntities: true
      }

      let specificOptions: TypeOrmModuleOptions

      switch (driver) {
        case 'sqlite':
          specificOptions = {
            ...commonOptions,
            type: 'sqlite',
            database: configService.get<string>('db.sqlite.database')
          }
          break
        case 'postgres':
          specificOptions = {
            ...commonOptions,
            type: 'postgres',
            host: configService.get<string>('db.pg.host'),
            port: configService.get<number>('db.pg.port'),
            database: configService.get<string>('db.pg.database'),
            username: configService.get<string>('db.pg.username'),
            password: configService.get<string>('db.pg.password'),
            ssl: isProduction,
            uuidExtension: 'pgcrypto'
          }
          break
        // Add cases for other drivers like 'mysql', 'mssql' here
      }

      return specificOptions
    }
  })
]
