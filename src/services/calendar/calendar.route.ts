import { FastifyPluginAsync,  } from 'fastify'

import { ADMIN_ROLE } from '../../config/env'
import { verifyJWTToken } from '../../config/token'

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

  app.post<{
    Headers: {token: string},
    Body: ICalendarCreate
  }>('/calendar', async (request, reply) => {
    const { token } = request.headers
    const { name, url, type } = request.body
    try {
      const isAdmin = await verifyJWTToken(token)
        .catch(err => app.log.error(err))
      if (isAdmin === ADMIN_ROLE) {
        const calendar = await createCalendar({ name, url, type })
        reply.code(201).send({ message: `Calendar: ${calendar} created` })
      } else {
        reply.code(401).send({ message: 'invaid token' })
      }
    } catch (err) {
      return err
    }
  })

}

export default calendar
