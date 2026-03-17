import { registerAs } from '@nestjs/config'

export const cacheConfig = registerAs('cache', () => ({
  driver: process.env.CACHE_DRIVER || 'memory',
  ttl: parseInt(process.env.CACHE_TTL || '60000', 10),
  maxSize: parseInt(process.env.CACHE_MAX_SIZE || '5000', 10),
  redisUrl: process.env.REDIS_URL
}))
