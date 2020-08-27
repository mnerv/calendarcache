import { AuthService } from './../auth/auth.service'
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
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'src/auth/gql-auth.guard'

@Resolver(CalendarType)
export class CalendarResolver {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly requestService: RequestLogService,
    private readonly authService: AuthService
  ) {}

  @Query(() => String)
  async Hello() {
    return ', World!'
  }

  @Query(() => [CalendarType])
  async calendars() {
    return await this.calendarService.findAll()
  }

  @Query(() => String)
  async login(
    @Args('username') username: string,
    @Args('password') password: string
  ) {
    return await this.authService
      .login(await this.authService.validateUser(username, password))
      .then((value) => {
        return value.acess_token
      })
  }

  @ResolveField()
  async requests(@Parent() calendar: CalendarType) {
    const { id } = calendar
    return this.requestService.findAll(id)
  }

  @UseGuards(GqlAuthGuard)
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
