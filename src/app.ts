import path from 'path'

import { fastify } from 'fastify'
import fastifyStatic from 'fastify-static'
import consola from 'consola'

import { redis } from './config/cache'
import { SERVER_PORT, SERVER_HOST, ROOT_DIR } from './config/env'
import { connectToDatabase } from './config/database'
import { generateAdminToken } from './config/token'

import calendar from './services/calendar/calendar.route'

const app = fastify({
  ignoreTrailingSlash: true
})

// Static files
app.register(fastifyStatic, {
  root: path.join(ROOT_DIR, 'public')
})

// Route registration
app.register(calendar)

app.get('/ping', async (request, reply) => {
  return 'pong!'
})

app.get('/', async (request, reply) => {
  return reply.sendFile('docs.html')
})

app.get('/spec.yml', async (req, rep) => {
  return rep.sendFile('spec.yml', path.join(ROOT_DIR, 'docs'))
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
    consola.error({
      message: err,
      badge: true
    })
    app.log.error(err)
    process.exit(1)
  }
}

main()
