import { registerAs } from '@nestjs/config'

export const apiConfig = registerAs('api', () => ({
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.API_PORT),
  secretKey: process.env.API_SECRET_KEY
}))
