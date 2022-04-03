/* eslint-disable max-len */
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load the .env configuration
dotenv.config()
const env = process.env

export const APP_PORT = parseInt(env.APP_PORT ?? '8080')
export const APP_HOST = env.APP_HOST          ?? '0.0.0.0'

export const REDIS_PORT = parseInt(env.REDIS_PORT ?? '6379')
export const REDIS_HOST = env.REDIS_HOST          ?? 'cache'

export const ROOT_DIR    = path.resolve()
export const DATA_PATH   = path.join(ROOT_DIR, 'data')
export const CACHE_TIME  = parseInt(env.CACHE_TIME  ?? `${15 * 60}`)
export const DELETE_TIME = parseInt(env.DELETE_TIME ?? '3600')

export const APP_VERSION = env.npm_package_version ?? 'development'

if (!fs.existsSync(DATA_PATH))
  fs.mkdirSync(DATA_PATH)
