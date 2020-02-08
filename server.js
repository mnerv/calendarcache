const { Nuxt, Builder } = require('nuxt')
const consola = require('consola')
const app = require('./backend/app')

const { PORT, isProd } = require('./configs/env.config')

const nuxtconfig = require('./configs/nuxt.config')
nuxtconfig.dev = false

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(nuxtconfig)

  const { host } = nuxt.options.server

  // Build only in dev mode
  if (nuxtconfig.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Start listening
  app.listen(PORT, host)
  consola.ready({
    message: `Server listening on http://${host}:${PORT}`,
    badge: true
  })
}

// Start the server
start()
