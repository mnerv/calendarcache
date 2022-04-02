import { FastifyPluginAsync } from 'fastify'
import { isLeft } from 'fp-ts/lib/Either'
import * as io from 'io-ts'
import { CalendarCreate, TCalendarCreate } from './calendar.model'

import CalService from './calendar.service'
import {
  CalendarException,
  CalendarSupportException
} from './calendars/exceptions'

const CalendarName = io.type({
  name: io.string,
})
type TCalendarName = io.TypeOf<typeof CalendarName>

const CalendarID = io.type({
  id: io.string,
})
type TCalendarID = io.TypeOf<typeof CalendarID>

const CalendarListQuery = io.type({
  id: io.union([io.string, io.undefined]),
})
type TCalendarListQuery = io.TypeOf<typeof CalendarListQuery>

const plugin: FastifyPluginAsync = async (app, opts) => {
  app.get<{Querystring: TCalendarListQuery}>('/', async (req, res) => {
    const decode = CalendarListQuery.decode(req.query)
    if (isLeft(decode))
      return res.send(await CalService.listInfo())

    console.log(decode)
    res.send(await CalService.listInfo())
  })

  app.get<{Params: TCalendarName}>('/:name', async (req, res) => {
    const { name } = req.params
    res.send({
      message: `Hello from calendar ${name}!`
    })
  })

  // TODO: Routes below needs to validate if the user has access rights to the calendar creation
  app.post<{Body: TCalendarCreate}>('/', async (req, res) => {
    const dec = CalendarCreate.decode(req.body)
    if (isLeft(dec)) {
      return res.status(400).send({
        error: 'Invalid request body',
      })
    }
    const { name, url } = dec.right
    try {
      const urls = Array.isArray(url) ? url : [url]
      await CalService.create(name, urls)
      res.send({
        message: `Calendar ${name} created successfully`
      })
    } catch (err) {
      if (err instanceof CalendarException)
        res.status(400).send({
          error: err.message,
        })
      else
        res.status(500).send({
          error: 'Internal server error',
        })
    }
  })

  app.patch<{Params: TCalendarID}>('/:id', async (req, res) => {
    throw new Error('[PATCH] Not implemented')
  })

  app.delete<{Params: TCalendarID}>('/:id', async (req, res) => {
    const { id } = req.params
    await CalService.delete(id)
    res.status(200).send({
      message: `Calendar ${id} deleted successfully`
    })
  })
}

export default plugin
