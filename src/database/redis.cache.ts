import Redis from 'ioredis'
import config from 'src/config/config'
import consola from 'consola'

export const CACHE_TIME = config.redis_cache_time

export const redis = new Redis(config.redis_port, config.redis_hostname)
redis.addListener('ready', () => {
  consola.ready({ message: 'Redis connected', badge: true })
})
redis.addListener('error', (err) => {
  consola.error(err)
})
