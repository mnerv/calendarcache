import path from 'path'

import 'reflect-metadata'
import consola from 'consola'
import { createConnection } from 'typeorm'

import {
  ROOT_DIR,
  ENTITY_PATH,
  DATABASE_NAME,
} from './env'

/**
 * Connect to the database server with environment variables. Needs to be call
 * when application initialized.
 *
 * @returns Connection promise
 */
export async function connectToDatabase(): Promise<void> {
  return new Promise<void>((reolve, reject) => {
    createConnection({
      type: 'sqlite',
      database: path.join(ROOT_DIR, 'data', DATABASE_NAME + '.sqlite'),
      synchronize: true,
      logging: false,
      dropSchema: false,
      entities: [
        path.resolve(ROOT_DIR, ENTITY_PATH)
      ]
    }).then(() => {
      consola.info({
        message: 'Connected database!',
      })
      reolve()
    }).catch(err => reject(err))
  })
}
