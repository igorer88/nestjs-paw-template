import { DynamicModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConnectOptions } from 'typeorm'

import { Environment } from '@/config'

export const databaseProviders: DynamicModule[] = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const isProduction =
        configService.get('api.environment') === Environment.Production

      return {
        ssl: isProduction,
        type: configService.get('db.pg.driver'),
        host: configService.get('db.pg.host'),
        port: configService.get('db.pg.port'),
        username: configService.get('db.pg.username'),
        password: configService.get('db.pg.password'),
        database: configService.get('db.pg.database'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        uuidExtension: 'pgcrypto',
        synchronize: isProduction ? false : true,
        autoLoadEntities: true
      } as ConnectOptions
    }
  })
]
