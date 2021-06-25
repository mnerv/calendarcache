import { fastify } from 'fastify'
import consola from 'consola'

import { redis } from './config/cache'
import { SERVER_PORT, SERVER_HOST } from './config/env'
import { connectToDatabase } from './config/database'
import { generateAdminToken } from './config/token'

import calendar from './services/calendar/calendar.route'

const app = fastify({
  logger: false,
  ignoreTrailingSlash: true
})

// Route registration
app.register(calendar)

app.get('/ping', async (request, reply) => {
  return 'pong!'
})

app.get('/', async (request, reply) => {
  return {
    message: 'Hello, World!'
  }
})

async function main() {
  try {
    await generateAdminToken()

    redis.status  // Check redis connection status
                  // Triggers the connection event

    await connectToDatabase().catch(err => {
      consola.error({
        message: err,
        badge: true
      })
    })

    const address = await app.listen(SERVER_PORT, SERVER_HOST)

    consola.ready({
      message: `Listening: ${address}`,
      badge: true
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
