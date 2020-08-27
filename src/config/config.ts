import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'

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
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'secretKey'
const JWT_EXPIRATION = process.env.JWT_EXPIRATION
  ? process.env.JWT_EXPIRATION
  : '1h'
const SALT = process.env.SALT ? parseInt(process.env.SALT) : 10

async function randomAdminSecret() {
  return new Promise<string>((resolve, reject) => {
    if (!fs.existsSync(path.join(ROOT_DIR, 'data', 'admin.secret'))) {
      const secret = nanoid()
      fs.writeFileSync(path.join(ROOT_DIR, 'data', 'admin.secret'), secret)
      resolve(secret)
    } else {
      fs.readFile(
        path.join(ROOT_DIR, 'data', 'admin.secret'),
        'utf8',
        (err, data) => {
          if (err) reject(err)
          resolve(data)
        }
      )
    }
  })
}

export async function createTokenFile() {
  if (!fs.existsSync(path.join(ROOT_DIR, 'data', 'admin_access.token'))) {
    const secret = await randomAdminSecret()
    const token = jwt.sign({ role: 'admin' }, secret)
    fs.writeFileSync(path.join(ROOT_DIR, 'data', 'admin_access.token'), token)
  }
}

export async function verifyJWTToken(token: string) {
  return new Promise<{ role: string; iat: number }>(async (resolve, reject) => {
    try {
      const res = jwt.verify(token, await randomAdminSecret()) as {
        role: string
        iat: number
      }
      resolve(res)
    } catch {
      reject('error token')
    }
  })
}

export default {
  hostname: HOSTNAME,
  port: PORT,
  redis_port: REDIS_PORT as number,
  redis_hostname: REDIS_HOSTNAME,
  redis_cache_time: REDIS_CACHE_TIME as number,
  create_calendar: CREATE_CALENDAR,
  override_url: OVERRIDE_URL,
  jwt_secret: JWT_SECRET,
  jwt_expire: JWT_EXPIRATION,
  salt: SALT,
}
