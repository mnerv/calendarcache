import { fastify } from 'fastify'
import Cors from '@fastify/cors'
import consola from 'consola'
import {
  APP_HOST,
  APP_PORT,
  APP_VERSION
} from './config/env'

// import docs from './docs'

import CalendarRoute from './calendar.route'

async function main() {
  const app = fastify({
    ignoreTrailingSlash: true,
    logger: {
      transport: {
        target: 'pino-pretty',
      }
    }
  })

  await app.register(Cors, { origin: '*' })
  // await docs(app)
  await app.register(CalendarRoute, { prefix: '/calendar' })

  app.get('/', (req, res) => {
    res.send({
      time: Date.now(),
      version: `${APP_VERSION}`,
      message: 'Hello, World!'
    })
  })

  try {
    const address = await app.listen({
      host: APP_HOST,
      port: APP_PORT
    })
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
