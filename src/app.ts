import { fastify } from 'fastify'
import consola from 'consola'

import { redis } from './config/cache'
import { SERVER_PORT, SERVER_HOST } from './config/env'
import { connectToDatabase } from './config/database'

const app = fastify({})

app.get('/ping', async (request, reply) => {
  return 'pong!\n'
})

app.get('/', async (request, reply) => {
  return 'Hello, World!\n'
})

app.listen(SERVER_PORT, SERVER_HOST, async (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  redis.status  // Check redis connection status
                // Triggers the connection event

  await connectToDatabase().catch(err => {
    consola.error({
      message: err,
      badge: true
    })
    process.exit(1) // FIXME: Maybe not actually exit
  })

  consola.ready({
    message: `Server listening at ${address}`,
    badge: true
  })
})
