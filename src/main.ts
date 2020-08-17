import fs from 'fs'
import path from 'path'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import consola from 'consola'
import { redis } from './database/redis.cache'
import config from 'src/config/config'

async function main() {
  const app = await NestFactory.create(AppModule)
  await app.listen(config.port, async () => {
    consola.ready({
      message: `Server running: http://${config.hostname}:${config.port}`,
      badge: true,
    })
  })
}

main().catch(consola.error)
