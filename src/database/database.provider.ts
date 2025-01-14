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
        type: configService.get('db.driver'),
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: isProduction ? false : true,
        autoLoadEntities: true
      } as ConnectOptions
    }
  })
]
