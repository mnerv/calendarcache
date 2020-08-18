import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()

export const ROOT_DIR = path.resolve()
if (!fs.existsSync(path.join(ROOT_DIR, 'data')))
  fs.mkdirSync(path.join(ROOT_DIR, 'data'))

if (!fs.existsSync(path.join(ROOT_DIR, 'data/ics')))
  fs.mkdirSync(path.join(ROOT_DIR, 'data', 'ics'))

const PORT = process.env.PORT || 3000
const HOSTNAME = process.env.HOSTNAME || 'localhost'
const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME || 'redis'
const REDIS_CACHE_TIME = 60 * 15
const CREATE_CALENDAR = process.env.CREATE_CALENDAR === 'true' || true
const OVERRIDE_URL = process.env.OVERRIDE_URL === 'true' || false
const TIMEZONE = process.env.TIMEZONE ? parseInt(process.env.TIMEZONE) : 0

export default {
  hostname: HOSTNAME,
  port: PORT,
  redis_port: REDIS_PORT as number,
  redis_hostname: REDIS_HOSTNAME,
  redis_cache_time: REDIS_CACHE_TIME as number,
  create_calendar: CREATE_CALENDAR,
  override_url: OVERRIDE_URL,
  timezone: TIMEZONE,
}
