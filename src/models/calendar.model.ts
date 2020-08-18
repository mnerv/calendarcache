import { CalendarRequestLogsType } from 'src/models/calendar-requestlogs.model'
import { Field, ObjectType, ID, Int } from '@nestjs/graphql'

@ObjectType()
export class CalendarType {
  @Field((type) => ID)
  id!: string

  @Field()
  readonly name!: string

  @Field()
  readonly ics_filename!: string

  @Field()
  readonly source_link!: string

  @Field((type) => Int)
  readonly total_requests?: number

  @Field((type) => Date, { nullable: true })
  readonly cached_at?: Date

  @Field((type) => Date)
  readonly updated!: Date

  @Field((type) => Date)
  readonly created!: number

  @Field((type) => [CalendarRequestLogsType])
  requests!: CalendarRequestLogsType[]
}
