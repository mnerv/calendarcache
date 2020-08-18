import CalendarRequeestLogsType from 'src/entity/calendar-activity.entity'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class RequestLogService {
  async findAll(calendar_id: string) {
    return await CalendarRequeestLogsType.find({
      where: { calendar: calendar_id },
    })
      .then((values) => {
        return values
      })
      .catch((err) => {
        throw new NotFoundException('Calendar log not found')
      })
  }

  async findCalendar(id: string) {
    return await CalendarRequeestLogsType.findOne({
      where: { id },
      relations: ['calendar'],
    }).then((reply) => {
      if (reply) return reply.calendar
      else throw new NotFoundException('Calendar not found')
    })
  }
}
