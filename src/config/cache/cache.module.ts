import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        ttl: configService.get<number>('cache.ttl', 60000)
      }),
      inject: [ConfigService]
    })
  ],
  exports: [CacheModule]
})
export class AppCacheModule {}
