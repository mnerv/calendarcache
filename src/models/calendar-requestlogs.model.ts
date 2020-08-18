import { CalendarType } from 'src/models/calendar.model'
import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class CalendarRequestLogsType {
  @Field((type) => ID)
  id!: number

  @Field((type) => Boolean)
  cached_request!: boolean

  @Field((type) => Boolean, { nullable: true })
  fetch_failed?: boolean

  @Field((type) => Date)
  created!: Date

  @Field((type) => CalendarType)
  calendar!: CalendarType
}
