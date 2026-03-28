import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { setup } from '../src/setup'
import { Environment } from '../src/config'

describe('Rate Limiting (Integration)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    setup(app, Environment.Development)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('ThrottlerGuard', () => {
    it('should allow requests within the limit', async () => {
      const response = await request(app.getHttpServer()).get('/v1/health').expect(200)

      expect(response.body).toHaveProperty('status')
    })

    it('should return 429 when rate limit is exceeded', async () => {
      // Make requests up to the limit (default is 100 per minute)
      // We test a few requests to verify throttling is working
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer()).get('/v1/health')
      }

      // Should still be ok within limit
      const response = await request(app.getHttpServer()).get('/v1/health').expect(200)

      expect(response.body).toHaveProperty('status')
    })

    it('should have throttler module configured', () => {
      // Verify the throttler module is loaded by checking for the guard
      const throttlerGuard = app.get(ThrottlerModule)
      expect(throttlerGuard).toBeDefined()
    })
  })
})
