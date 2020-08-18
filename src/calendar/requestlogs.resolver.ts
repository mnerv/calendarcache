import { CalendarRequestLogsType } from 'src/models/calendar-requestlogs.model'
import { CalendarService } from './calendar.service'
import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql'
import { RequestLogService } from './requestlog.service'

@Resolver(CalendarRequestLogsType)
export class RequestLogsResolver {
  constructor(private readonly requestService: RequestLogService) {}

  @Query(() => [CalendarRequestLogsType])
  async requestlogs(@Args('calendar_id') calendar_id: string) {
    return this.requestService.findAll(calendar_id)
  }

  @ResolveField()
  async calendar(@Parent() requestlogs: CalendarRequestLogsType) {
    return this.requestService.findCalendar(requestlogs.id.toString())
  }
}
