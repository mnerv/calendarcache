import { FastifyPluginAsync } from 'fastify'
import { isLeft } from 'fp-ts/lib/Either'
import * as io from 'io-ts'
import { CalendarCreate, TCalendarCreate } from './calendar.model'

import CalendarService from './calendar.service'
import { CalendarException } from './calendars/exceptions'
import CalendarSupport, { CalendarFile } from './calendars/supported'

const CalendarName = io.type({
  name: io.string,
})
type TCalendarName = io.TypeOf<typeof CalendarName>

const CalendarID = io.type({
  id: io.string,
})
type TCalendarID = io.TypeOf<typeof CalendarID>

const CalendarListQuery = io.type({
  limit: io.union([io.string, io.undefined]),
  id: io.union([io.string, io.undefined]),
})
type TCalendarListQuery = io.TypeOf<typeof CalendarListQuery>

const plugin: FastifyPluginAsync = async (app, _) => {
  app.get<{Querystring: TCalendarListQuery}>('/', async (req, res) => {
    const decode = CalendarListQuery.decode(req.query)
    if (isLeft(decode))
      return res.send(await CalendarService.listInfo())
    res.send(await CalendarService.listInfo())
  })

  app.get<{Params: TCalendarName}>('/:name', async (req, res) => {
    const { name: nameExt } = req.params
    const name = CalendarSupport.removeExtension(nameExt)
    const filetype = CalendarSupport.getType(nameExt)
    const text = await CalendarService.loadEvents(filetype, name)
    switch (filetype) {
    case CalendarFile.ICS:
      res.header('content-type', 'text/calendar; charset=utf-8')
      break
    case CalendarFile.JSON:
    default:
      res.header('content-type', 'application/json')
      break
    }
    res.send(text)
  })

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
      await CalendarService.create(name, urls)
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

  // TODO: Routes below needs to validate if the user has access rights to the calendar creation
  app.patch<{Params: TCalendarID}>('/:id', async (req, res) => {
    throw new Error('[PATCH] Not implemented')
  })

  // app.delete<{Params: TCalendarID}>('/:id', async (req, res) => {
  //   const { id } = req.params
  //   await CalService.delete(id)
  //   res.status(200).send({
  //     message: `Calendar ${id} deleted successfully`
  //   })
  // })
}

export default plugin
