import Redis from 'ioredis'
import consola from 'consola'
import { REDIS_PORT, REDIS_HOST } from './env'

export const redis = new Redis(REDIS_PORT, REDIS_HOST)

redis.addListener('connect', () => {
  consola.info({
    message: 'Connected to Redis cache!'
  })
})

redis.addListener('error', err => {
  consola.error({
    message: err,
    badge: true
  })
})

redis.addListener('close', () => {
  consola.info({
    message: 'Disconnected from Redis cache!'
  })
})
