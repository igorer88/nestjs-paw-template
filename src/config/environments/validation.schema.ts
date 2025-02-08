import Joi from 'joi'

import { Environment } from '../enums'

export const getValidationSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    NODE_ENV: Joi.string()
      .default(Environment.Development)
      .valid(Environment.Development, Environment.Production),
    API_PORT: Joi.number().default(3000),
    API_SECRET_KEY: Joi.string().required(),
    // DB credentials
    DB_DRIVER: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PORT: Joi.string().required()
  }).unknown(true)
}
