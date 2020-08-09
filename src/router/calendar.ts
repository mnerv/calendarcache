import express from 'express'
import path from 'path'
import consola from 'consola'
import GetCalendar from '../functions/GetCalendar'

const router = express.Router()

const link = 'http://localhost:4000'

router.get('/test', (req, res, next) => {
  GetCalendar(link)
    .then((value) => {
      consola.log(`resolve: ${value}`)
      res.sendStatus(200)
    })
    .catch((error) => {
      consola.warn({ message: `reject: ${error}` })
      res.sendStatus(500)
    })
})

export default router
