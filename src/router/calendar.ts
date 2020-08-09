import { sq } from '../database/database'
import CalendarModel from '../database/model/CalendarModel'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import consola from 'consola'
import GetCalendar from '../functions/GetCalendar'
import { nanoid } from 'nanoid'

const router = express.Router()

const ROOT_DIR = path.resolve()

router.post('/create', (req, res, next) => {
  const link: string = req.body.link
  const filename = req.query.filename
    ? req.query.filename + '.ics'
    : nanoid() + '.ics'
  if (link === undefined) res.status(404).send('No given link')
  else
    sq.sync().then(() => {
      CalendarModel.Create(filename, 'data/ics', link)
        .then(() => {
          GetCalendar(link, filename)
            .then((value) => {
              consola.trace(`${value}`)
              res.sendStatus(201)
            })
            .catch((error) => {
              consola.warn({ message: `${error}` })
              res.status(500).json({ msg: error })
            })
        })
        .catch((err) => {
          consola.error(err)
          res.status(409).json({ msg: 'Duplicate name/link' })
        })
    })
})

router.get('/all', (req, res, next) => {
  CalendarModel.findAll()
    .then((values) => {
      res.json(values)
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(404)
    })
})

router.get('/:filename', (req, res, next) => {
  CalendarModel.findOne({
    where: { filename: req.params.filename },
  })
    .then((value) => {
      if (value) {
        res
          .status(200)
          .sendFile(path.join(ROOT_DIR, 'data/ics', req.params.filename))
      } else res.status(404).json({ msg: 'file not found' })
    })
    .catch((err) => {
      res.sendStatus(500)
    })
})

export default router
