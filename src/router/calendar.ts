import { sq, client } from '../database/database'
import CalendarModel from '../database/model/CalendarModel'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import consola from 'consola'
import GetCalendar from '../functions/GetCalendar'
import { nanoid } from 'nanoid'

const router = express.Router()

const ROOT_DIR = path.resolve()
const CACHE_TIME = 60 * 10

const BAD_PATTERN = /[=&:/<>.*+\-?^${}()|[\]\\]/g

router.post('/create', (req, res, next) => {
  const link: string = req.body.link
  const name: string = req.query.name ? req.query.name.toString() : nanoid()

  if (name.match(BAD_PATTERN))
    res.status(400).json({
      msg: 'Error pattern, character =&:/<>.*+-?^${}()|[]\\ are not allowed',
    })
  else if (link === undefined) res.status(404).send('No given link')
  else {
    const TOBE = {
      name: name.replace(BAD_PATTERN, '_'),
      ics_filename: name.replace(BAD_PATTERN, '_') + '_' + nanoid() + '.ics',
      source_link: link,
    }
    CalendarModel.create(TOBE)
      .then((data) => {
        GetCalendar(link, data.getDataValue('ics_filename'))
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
  }
})

router.get('/all', (req, res, next) => {
  CalendarModel.findAll()
    .then((datas) => {
      res.json(datas)
    })
    .catch((err) => {
      consola.log(err)
      res.sendStatus(404)
    })
})

router.get('/:name', (req, res, next) => {
  CalendarModel.findOne({
    where: { name: req.params.name.toString().replace('.ics', '') },
  })
    .then((data) => {
      if (data) {
        client.get(
          req.params.name.toString().replace('.ics', ''),
          async (err, reply) => {
            if (!reply) {
              await GetCalendar(
                data.getDataValue('source_link'),
                data.getDataValue('ics_filename')
              )
              client.setex(
                req.params.name.toString().replace('.ics', ''),
                CACHE_TIME,
                data.getDataValue('ics_filename')
              )
            }
          }
        )

        data.increment('total_request')
        res
          .status(200)
          .sendFile(
            path.join(ROOT_DIR, 'data/ics', data.getDataValue('ics_filename'))
          )
      } else res.status(404).json('file not found')
    })
    .catch((err) => {
      res.sendStatus(500)
    })
})

export default router
