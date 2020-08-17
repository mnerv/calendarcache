import CalendarRequeestLogsType from 'src/entity/calendar-activity.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RequestLogService {
  async findAll(calendar_id: string) {
    return CalendarRequeestLogsType.find({ where: { calendar: calendar_id } })
  }
}
