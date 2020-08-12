import { CalendarService } from './calendar.service'
import { CalendarType, CalendarInput } from './../database/calendar.model'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

@Resolver()
export class CalendarResolver {
  constructor(private readonly service: CalendarService) {}

  @Query(() => String)
  async Hello() {
    return ', World!'
  }

  @Query(() => [CalendarType])
  calendars() {
    return this.service.getAll()
  }

  @Mutation(() => CalendarType)
  async createCalendar(@Args('input') input: CalendarInput) {
    if (input.name === '' || input.source_link === '')
      throw new Error('name or source_link are emepty')
    return this.service.create(input)
  }

  @Mutation(() => String)
  async deleteCalendar(@Args('id') id: number) {
    // const res = await this.service.deleteCalendar(id)
    if (1 === 1) return `Deleted calendar with id: ${id}`
    else throw new Error('Error invalid id or item not found')
  }
}
