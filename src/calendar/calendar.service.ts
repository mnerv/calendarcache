import CalendarRequestLogsEntity from 'src/entity/calendar-activity.entity'
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  ConflictException,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common'
import CalendarEntity from 'src/entity/calendar.entity'
import { Connection } from 'typeorm'
import { URL_SIG } from './parser/KronoxMAU'
import { nanoid } from 'nanoid'
import { CalendarDTO } from 'src/models/calendar.dto'
import config from 'src/config/config'
import GetCalendar from './parser/GetCalendar'
import { redis, CACHE_TIME } from '../database/redis.cache'
import consola from 'consola'

@Injectable()
export class CalendarService {
  constructor(private db: Connection) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  async create(input: CalendarDTO) {
    if (!input.source_link.includes(URL_SIG) && !config.override_url)
      throw new ForbiddenException('source_link does not matched url signature')

    if (input.name.match(/[=&:/<>.*+\-?^${}()|[\]\\]/g))
      throw new BadRequestException(
        'Characters =&:/<>.*+-?^${}()|[]\\ are not allowed'
      )

    return this.db.transaction(async (m) => {
      const ics = input.name + nanoid() + '.ics'
      return m
        .save(new CalendarEntity(input.name, ics, input.source_link))
        .then(async (reply) => {
          reply.cached_at = new Date()
          reply.requests = []
          if (config.create_calendar)
            await GetCalendar(reply.source_link, reply.ics_filename).catch(
              consola.error
            )
          await redis.setex(reply.name, CACHE_TIME, reply.ics_filename)
          await reply.save()
          return reply
        })
        .catch((err) => {
          switch (err.errno) {
            case 19:
              if (err.message.includes('calendars.source_link'))
                throw new ConflictException('Duplicate source_link')
              if (err.message.includes('calendars.name'))
                throw new ConflictException('Duplicate name')
              break
            default:
              throw new InternalServerErrorException()
          }
        })
    })
  }

  async findAll() {
    return CalendarEntity.find()
  }

  async findOne(id: string) {
    return await CalendarEntity.findOne({ where: { id } })
      .then((reply) => {
        return reply
      })
      .catch((err) => {
        throw new NotFoundException('Calendar not found')
      })
  }

  async getCalendar(name: string) {
    return CalendarEntity.findOne({ where: { name } }).then(async (reply) => {
      if (reply) {
        const log = new CalendarRequestLogsEntity()
        await redis.get(reply.name).then(async (value) => {
          if (!value) {
            await GetCalendar(reply.source_link, reply.ics_filename)
              .then((value) => {
                log.fetch_failed = false
                log.cached_request = false
              })
              .catch((err) => {
                log.fetch_failed = true
                log.cached_request = true
              })

            redis.setex(reply.name, CACHE_TIME, reply.ics_filename)
            reply.cached_at = new Date()
          } else log.cached_request = true
        })

        log.calendar = reply
        reply.total_requests += 1
        await log.save()
        await reply.save()
        return { ...reply }
      } else {
        throw new NotFoundException(
          `Can't find the calendar with the name ${name}`
        )
      }
    })
  }

  async editCalendar(id: string, name: string, link: string) {}

  async deleteCalendar(id: number) {}
}
