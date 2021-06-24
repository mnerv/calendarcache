import { FastifyPluginAsync,  } from 'fastify'

import {
  createCalendar,
  findAllCalendars,
  getCalendar
} from './calendar.service'

import {
  CalendarFileType,
  ICalendar,
  ICalendarCreate
} from '../../model/calendar.model'

const calendar: FastifyPluginAsync = async (app, opts) => {

  app.get('/calendar', async (request, reply) => {
    return findAllCalendars()
  })

  app.get<{Params: ICalendar}>('/calendar/:name', async (request, reply) => {
    const { name } = request.params
    try {
      const data = await getCalendar(name)
      if (data.type == CalendarFileType.ICS)
        reply
          .status(200)
          .type('text/calendar; charset=utf-8')
          .send(data.buffer)
      else if (data.type == CalendarFileType.JSON)
        reply.send(JSON.parse(data.buffer.toString()))
    } catch (err) {
      reply.status(404).send(err)
    }
  })

  app.post<{Body: ICalendarCreate}>('/calendar', async (request, reply) => {
    const { name, url, type } = request.body
    try {
      const calendar = await createCalendar({ name, url, type })
      return {
        message: `Created calendar: ${calendar}`,
      }
    } catch (err) {
      return err
    }
  })

}

export default calendar
