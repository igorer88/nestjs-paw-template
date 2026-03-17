import { throttlerConfig } from '../environment/throttler.config'

describe('ThrottlerConfig', () => {
  describe('throttlerConfig', () => {
    it('should return the correct configuration object', () => {
      const config = throttlerConfig()

      expect(config).toBeDefined()
      expect(config).toHaveProperty('ttl')
      expect(config).toHaveProperty('limit')
    })

    it('should have default values when env vars are not set', () => {
      const originalTtl = process.env.THROTTLE_TTL
      const originalLimit = process.env.THROTTLE_LIMIT

      delete process.env.THROTTLE_TTL
      delete process.env.THROTTLE_LIMIT

      const config = throttlerConfig()

      expect(config.ttl).toBe(60000)
      expect(config.limit).toBe(100)

      if (originalTtl) process.env.THROTTLE_TTL = originalTtl
      if (originalLimit) process.env.THROTTLE_LIMIT = originalLimit
    })

    it('should parse custom TTL from environment variable', () => {
      const originalTtl = process.env.THROTTLE_TTL
      process.env.THROTTLE_TTL = '30000'

      const config = throttlerConfig()

      expect(config.ttl).toBe(30000)

      if (originalTtl) process.env.THROTTLE_TTL = originalTtl
      else delete process.env.THROTTLE_TTL
    })

    it('should parse custom limit from environment variable', () => {
      const originalLimit = process.env.THROTTLE_LIMIT
      process.env.THROTTLE_LIMIT = '50'

      const config = throttlerConfig()

      expect(config.limit).toBe(50)

      if (originalLimit) process.env.THROTTLE_LIMIT = originalLimit
      else delete process.env.THROTTLE_LIMIT
    })
  })
})
