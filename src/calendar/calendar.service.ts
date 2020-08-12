import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CalendarModel, Calendar } from './../database/calendar.model'
import GetCalendar from './parser/GetCalendar'
import { nanoid } from 'nanoid'
import { red, CACHE_TIME } from '../database/redis.cache'
import KronoxMAU from './parser/KronoxMAU'

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(CalendarModel)
    private model: typeof CalendarModel
  ) {}

  async create(input: Calendar) {
    if (input.source_link.includes(KronoxMAU.URL_SIG)) {
      input.ics_filename = input.name + nanoid() + '.ics'
      return await this.model
        .create(input)
        .then((data) => {
          GetCalendar(data.source_link, data.ics_filename)
            .then((value) => {
              red.setex(name, CACHE_TIME, data.ics_filename)
              return data
            })
            .catch((err) => {
              return err
            })
        })
        .catch((err) => {
          return err
        })
    } else
      throw new ForbiddenException(
        'source_link does not matched the url signature'
      )
  }

  async getAll() {
    return await this.model.findAll()
  }

  async getCalendar(name: string) {
    return await this.model.findOne({ where: { name } }).then((data) => {
      if (data) {
        red.get(name, async (err, reply) => {
          if (!reply) {
            await GetCalendar(data.source_link, data.ics_filename)
            red.setex(name, CACHE_TIME, data.ics_filename)
          }
        })
        data.increment('total_request')
        return data.ics_filename
      } else {
        throw new NotFoundException('Calendar not found')
      }
    })
  }

  async editCalendar(id: string, name: string, link: string) {}

  async deleteCalendar(id: number) {
    return await this.model.destroy({ where: { id: id } })
  }
}
