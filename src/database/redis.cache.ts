import redis from 'redis'

const REDIS_PORT = 6379
const REDIS_HOST = false ? 'localhost' : 'redis'

export const CACHE_TIME = 60 * 20
export const red = redis.createClient(REDIS_PORT, REDIS_HOST)
