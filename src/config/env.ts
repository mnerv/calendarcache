/* eslint-disable max-len */
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load the .env configuration
dotenv.config()

const env                  = process.env
const IS_PRODUCTION        = env.NODE_ENV == 'production' ? true : false
const ENV_PORT             = env.PORT                    || '8080'
const ENV_REDIS_PORT       = env.REDIS_PORT              || '5432'
const ENV_SALT_ROUNDS      = env.SALT_ROUNDS             || '10'
const ENV_MACHINE_ID       = env.MACHINE_ID              || '0'  // 12-bit

export const ENTITY_PATH   = IS_PRODUCTION ? 'build/entity/**/*.js' : 'src/entity/**/*.ts'
export const ROOT_DIR      = path.resolve()
export const SERVER_PORT   = parseInt(ENV_PORT)
export const SERVER_HOST   = env.HOST                    || '127.0.0.1'

export const DATABASE_NAME = env.DATABASE_NAME           || 'database'

export const REDIS_PORT    = parseInt(ENV_REDIS_PORT)
export const REDIS_HOST    = env.REDIS_HOST              || 'localhost'

export const SALT_ROUNDS   = parseInt(ENV_SALT_ROUNDS)
export const MACHINE_ID    = parseInt(ENV_MACHINE_ID)

if (!fs.existsSync(path.join(ROOT_DIR, 'data')))
  fs.mkdirSync(path.join(ROOT_DIR, 'data'))

export default {
  ROOT_DIR,
  ENTITY_PATH,
  SERVER_PORT,
  SERVER_HOST,
  DATABASE_NAME,
  REDIS_PORT,
  REDIS_HOST,
  SALT_ROUNDS
}
