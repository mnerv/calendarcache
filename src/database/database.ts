import path from 'path'
import { Sequelize } from 'sequelize'
import CalendarModel from './model/CalendarModel'
import redis from 'redis'

const ROOT_DIR = path.join(__dirname, '..', '..')

const REDIS_PORT = 6379
export const client = redis.createClient(REDIS_PORT)
export const sq = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(ROOT_DIR, 'data', 'database.sqlite'),
  logging: false,
})

CalendarModel.define(sq)

export default { sq, client }
