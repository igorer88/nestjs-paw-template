import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { setup } from '../src/setup'
import { Environment } from '../src/config'

describe('Health Check (e2e)', () => {
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

  describe('/health (GET)', () => {
    it('should return application status', () => {
      return request(app.getHttpServer())
        .get('/v1/health')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('status')
          expect(res.body.status).toBe('Ok')
        })
    })

    it('should return health status with correct content type', () => {
      return request(app.getHttpServer()).get('/v1/health').expect('Content-Type', /json/)
    })
  })

  describe('/health/db (GET)', () => {
    it('should return database connection status', () => {
      return request(app.getHttpServer())
        .get('/v1/health/db')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('status')
        })
    })
  })
})
