/* eslint-disable max-len */
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load the .env configuration
dotenv.config()

const env                  = process.env
export const IS_PRODUCTION = env.NODE_ENV == 'production' ? true : false
const ENV_PORT             = env.PORT                    || '8080'
const ENV_REDIS_PORT       = env.REDIS_PORT              || '5432'
const ENV_SALT_ROUNDS      = env.SALT_ROUNDS             || '10'
const ENV_MACHINE_ID       = env.MACHINE_ID              || '0'   // 12-bit
const ENV_CACHE_TIME       = env.CACHE_TIME              || '900' // s

export const ENTITY_PATH   = IS_PRODUCTION ? 'build/entity/**/*.js' : 'src/entity/**/*.ts'
export const ROOT_DIR      = path.resolve()
export const SERVER_PORT   = parseInt(ENV_PORT)
export const SERVER_HOST   = env.HOST                    || '127.0.0.1'

export const DATABASE_NAME = env.DATABASE_NAME           || 'database'

export const REDIS_PORT    = parseInt(ENV_REDIS_PORT)
export const REDIS_HOST    = env.REDIS_HOST              || 'localhost'
export const CACHE_TIME    = parseInt(ENV_CACHE_TIME)

export const SALT_ROUNDS   = parseInt(ENV_SALT_ROUNDS)
export const MACHINE_ID    = parseInt(ENV_MACHINE_ID)

export const DATA_PATH     = path.join(ROOT_DIR, 'data')
export const ICS_PATH      = path.join(DATA_PATH, 'ics')
export const JSON_PATH     = path.join(DATA_PATH, 'json')

export const ICS_EXT       = /.ics/
export const JSON_EXT      = /.json/

if (!fs.existsSync(DATA_PATH))
  fs.mkdirSync(DATA_PATH)

if (!fs.existsSync(ICS_PATH))
  fs.mkdirSync(ICS_PATH)

if (!fs.existsSync(JSON_PATH))
  fs.mkdirSync(JSON_PATH)

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
