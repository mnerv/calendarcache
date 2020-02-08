const bluebird = require('bluebird')
const redis = require('redis')
bluebird.promisifyAll(redis)
const { REDIS_PORT } = require('../../configs/env.config')

const redis_config = {
  port: REDIS_PORT,
  retry_strategy: options => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  }
}

const rclient = redis.createClient(redis_config)

rclient.on('error', err => {
  console.log(err)
})

rclient.on('connect', _ => {
  console.log('connecting to database...')
})

rclient.on('reconnecting', _ => {
  console.log('reconnecting to database...')
})

rclient.on('ready', _ => {
  console.log('database ready...')
})

rclient.on('end', _ => {
  console.log('lost connection to database...')
})

// Cache middleware
async function redis_cache(req, res, next) {
  const { id } = req.params

  rclient
    .getAsync(id)
    .then(data => {
      if (data != null) res.status(200).json({ id, data })
      else next()
    })
    .catch(err => {
      throw err
    })
}

module.exports = rclient
