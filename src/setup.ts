import { readFileSync } from 'fs'

import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
  VersioningType
} from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'

import { Environment } from './config'

export const getAppMetadata = (
  packageFile = 'package.json'
): {
  name: string
  version: string
  description: string
  author: string
  private: boolean
  license: string
} => {
  try {
    const data = readFileSync(packageFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw error
  }
}

export function setup(
  app: INestApplication,
  environment: Environment
): INestApplication {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'health/db', method: RequestMethod.GET }
    ]
  })

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  })

  app.use(
    helmet({
      contentSecurityPolicy: environment === Environment.Production,
      crossOriginEmbedderPolicy: environment === Environment.Production,
      xContentTypeOptions: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    })
  )

  const appMetadata = getAppMetadata()
  const config = new DocumentBuilder()
    .setTitle(appMetadata.name)
    .setDescription(appMetadata.description)
    .setVersion(appMetadata.version)
    .build()
  const document = SwaggerModule.createDocument(app, config)
  if (environment === Environment.Development) {
    SwaggerModule.setup('docs', app, document)
  }
  return app
}
