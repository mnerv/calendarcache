import { IsNotEmpty, MinLength, ArrayNotContains } from 'class-validator'

export class CalendarDTO {
  @IsNotEmpty()
  @MinLength(1)
  name!: string

  @IsNotEmpty()
  @MinLength(1)
  source_link!: string
}
