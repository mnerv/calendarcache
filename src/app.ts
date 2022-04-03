import { fastify } from 'fastify'
import fastifyCors from 'fastify-cors'
import consola from 'consola'
import { APP_HOST, APP_PORT } from './config/env'

import CalendarRoute from './calendar.route'

const app = fastify({
  ignoreTrailingSlash: true
})

app.register(fastifyCors, { origin: '*' })
app.register(CalendarRoute, { prefix: '/beta/calendar' })

app.get('/', (req, res) => {
  res.send({
    random: Math.random(),
    message: 'Hello, World!'
  })
})

async function main() {
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
