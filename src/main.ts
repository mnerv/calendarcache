import fs from 'fs'
import path from 'path'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import consola from 'consola'
import { red } from './database/redis.cache'

const PORT = 3000
const ROOT_DIR = path.resolve()

function init() {
  if (!fs.existsSync(path.join(ROOT_DIR, 'data')))
    fs.mkdirSync(path.join(ROOT_DIR, 'data'))
  if (!fs.existsSync(path.join(ROOT_DIR, 'data/ics')))
    fs.mkdirSync(path.join(ROOT_DIR, 'data', 'ics'))
}

async function main() {
  init()

  consola.log({ message: `redis connected: ${red.connected}` })

  const app = await NestFactory.create(AppModule)
  await app.listen(PORT)
}

main().catch(consola.error)
