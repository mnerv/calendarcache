/* eslint-disable max-len */
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load the .env configuration
dotenv.config()
const env = process.env

export const APP_PORT = parseInt(env.APP_PORT ?? '3000')
export const APP_HOST = env.APP_HOST          ?? 'localhost'

export const REDIS_PORT = parseInt(env.REDIS_PORT ?? '6379')
export const REDIS_HOST = env.REDIS_HOST          ?? 'localhost'

export const ROOT_DIR   = path.resolve()
export const CACHE_TIME = parseInt(env.CACHE_TIME ?? '10')
export const DATA_PATH  = path.join(ROOT_DIR, 'data')

export const ICS_EXT = /.ics/

if (!fs.existsSync(DATA_PATH))
  fs.mkdirSync(DATA_PATH)
