import Joi from 'joi'

import { Environment } from '../enums'
import { dbFolder } from './db.config'

export const getValidationSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    NODE_ENV: Joi.string()
      .default(Environment.Development)
      .valid(Environment.Development, Environment.Production),
    API_PORT: Joi.number().integer().min(1).max(65535).default(3000).required(),
    API_SECRET_KEY: Joi.string().required().min(32),
    ALLOWED_ORIGINS: Joi.string().when('NODE_ENV', {
      is: Environment.Production,
      then: Joi.string().required(),
      otherwise: Joi.string().default('http://localhost:3000')
    }),
    IP_LOG_LEVEL: Joi.string()
      .valid('enabled', 'disabled', 'anonymized')
      .default('anonymized'),
    // DB credentials
    DB_DRIVER: Joi.string()
      .default('sqlite')
      .valid('postgres', 'sqlite', 'mysql', 'mssql'),
    DB_SQLITE_PATH: Joi.string().when('DB_DRIVER', {
      is: 'sqlite',
      then: Joi.string().default(`${dbFolder}/db.sqlite3`),
      otherwise: Joi.optional()
    }),
    DB_HOST: Joi.string().when('DB_DRIVER', {
      is: Joi.string().valid('postgres', 'mysql', 'mssql'),
      then: Joi.string().required(),
      otherwise: Joi.optional()
    }),
    DB_PORT: Joi.number()
      .integer()
      .min(1)
      .max(65535)
      .when('DB_DRIVER', {
        is: Joi.string().valid('postgres', 'mysql', 'mssql'),
        then: Joi.number().required(),
        otherwise: Joi.optional()
      }),
    DB_NAME: Joi.string().when('DB_DRIVER', {
      is: Joi.string().valid('postgres', 'mysql', 'mssql'),
      then: Joi.string().required(),
      otherwise: Joi.optional()
    }),
    DB_USER: Joi.string().when('DB_DRIVER', {
      is: Joi.string().valid('postgres', 'mysql', 'mssql'),
      then: Joi.string().required(),
      otherwise: Joi.optional()
    }),
    DB_PASSWORD: Joi.string().when('DB_DRIVER', {
      is: Joi.string().valid('postgres', 'mysql', 'mssql'),
      then: Joi.string().required(),
      otherwise: Joi.optional()
    }),
    // Cache configuration
    CACHE_DRIVER: Joi.string().default('memory').valid('memory', 'redis'),
    CACHE_TTL: Joi.number().integer().min(0).default(60000),
    CACHE_MAX_SIZE: Joi.number().integer().min(1).default(5000),
    REDIS_URL: Joi.string()
      .uri({ scheme: 'redis' })
      .default('redis://localhost:6379')
  }).unknown(true)
}
