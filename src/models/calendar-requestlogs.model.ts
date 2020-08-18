import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class CalendarRequeestLogsType {
  @Field((type) => ID)
  id!: number

  @Field((type) => Boolean)
  cached_request!: boolean

  @Field((type) => Boolean, { nullable: true })
  fetch_failed!: boolean

  @Field((type) => Date)
  created!: Date
}
