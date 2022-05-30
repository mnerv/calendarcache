import { fastify } from 'fastify'
import Cors from '@fastify/cors'
import consola from 'consola'
import { APP_HOST, APP_PORT } from './config/env'

import CalendarRoute from './calendar.route'

async function main() {
  const app = fastify({
    ignoreTrailingSlash: true
  })

  app.decorate('asyncVerifyAdmin', async (request: any, reply: any, done: any) => {
    reply.status(401).send({
      error: 'Unauthorized',
    })
    done() // pass an error if the authentication fails
  })

  await app.register(Cors, { origin: '*' })
  await app.register(CalendarRoute, { prefix: '/calendar' })

  app.get('/', (req, res) => {
    res.send({
      random: Math.random(),
      message: 'Hello, World!'
    })
  })

  try {
    const address = await app.listen(APP_PORT, APP_HOST)
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
