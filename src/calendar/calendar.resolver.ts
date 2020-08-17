import { CalendarDTO } from 'src/models/calendar.dto'
import { CalendarService } from './calendar.service'
import { CalendarType } from 'src/models/calendar.model'
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { RequestLogService } from './requestlog.service'

@Resolver(CalendarType)
export class CalendarResolver {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly requestService: RequestLogService
  ) {}

  @Query(() => String)
  async Hello() {
    return ', World!'
  }

  @Query(() => [CalendarType])
  async calendars() {
    return await this.calendarService.findAll()
  }

  @ResolveField()
  async requests(@Parent() calendar: CalendarType) {
    const { id } = calendar
    return this.requestService.findAll(id)
  }

  @Mutation(() => CalendarType)
  async createCalendar(
    @Args('name') name: string,
    @Args('source_link') source_link: string
  ) {
    const c = new CalendarDTO()
    c.name = name
    c.source_link = source_link
    return this.calendarService.create(c)
  }
}
