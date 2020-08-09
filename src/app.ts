import path from 'path'
import express, { Application, Request, Response, NextFunction } from 'express'
import consola from 'consola'
import cors from 'cors'
import { nanoid } from 'nanoid'
import { sq } from './database/database'
import calendar from './router/calendar'
import fs from 'fs'

const PORT = 3000
const ROOT_DIR = path.resolve()

if (!fs.existsSync(path.join(ROOT_DIR, 'data')))
  fs.mkdirSync(path.join(ROOT_DIR, 'data'))
if (!fs.existsSync(path.join(ROOT_DIR, 'data/ics')))
  fs.mkdirSync(path.join(ROOT_DIR, 'data', 'ics'))

const app = express()
sq.authenticate()

app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(express.json())
app.use(cors())

app.use('/calendar', calendar)

app.get('/', (req, res, next) => {
  res.status(200).send(nanoid())
})

app.listen(PORT, () => {
  consola.ready({
    message: `Server running on http://localhost:${PORT}`,
    badge: true,
  })
})
