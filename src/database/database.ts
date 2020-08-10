import path from 'path'
import { Sequelize } from 'sequelize'
import CalendarModel from './model/CalendarModel'
import redis from 'redis'

const ROOT_DIR = path.resolve()
const REDIS_PORT = 6379
const REDIS_HOST = 'redis'

export const client = redis.createClient(REDIS_PORT, REDIS_HOST)

export const sq = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(ROOT_DIR, 'data', 'calendars.sqlite'),
  logging: false,
})

CalendarModel.define(sq)

sq.sync({ force: false }).then(() => {})
