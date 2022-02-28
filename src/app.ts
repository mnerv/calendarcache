import { fastify } from 'fastify'
import fastifyCors from 'fastify-cors'
import consola from 'consola'

import { redis } from './config/redis'
import {
  SERVER_PORT,
  SERVER_HOST,
} from './config/env'

const app = fastify({
  ignoreTrailingSlash: true
})

app.register(fastifyCors, {
  origin: '*'
})

app.get('/ping', async (req, rep) => {
  return 'pong!'
})

async function main() {
  try {
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
