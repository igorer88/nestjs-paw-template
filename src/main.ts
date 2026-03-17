import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { Environment, logLevel } from './config'
import { setup } from './setup'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: logLevel
  })

  app.getHttpAdapter().getInstance().set('trust proxy', 1)

  const environment = AppModule.environment as Environment
  const port = AppModule.port as number

  app.enableCors({
    origin: AppModule.allowedOrigins,
    credentials: true
  })

  const logger = new Logger('Bootstrap')

  setup(app, environment)

  await app.listen(port)
  logger.log(`Server running in: '${environment}' environment`)
  logger.log(`Server started on port: ${port}`)
}
bootstrap()
