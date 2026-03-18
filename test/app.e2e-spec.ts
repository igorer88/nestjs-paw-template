import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from './../src/app.module'
import { setup } from './../src/setup'
import { Environment } from '../src/config'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    setup(app, Environment.Development)
    await app.init()
  })

  it('/v1/health (GET) - health endpoint should be accessible', () => {
    return request(app.getHttpServer()).get('/v1/health').expect(200)
  })
})
