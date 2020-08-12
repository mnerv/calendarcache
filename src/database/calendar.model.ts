import { Table, Model, Column, DataType } from 'sequelize-typescript'
import { InputType, Field, ObjectType, ID, Int } from '@nestjs/graphql'

export interface Calendar {
  name: string
  ics_filename?: string
  source_link: string
  total_request?: number
}

@InputType()
export class CalendarInput implements Calendar {
  @Field()
  name!: string
  @Field()
  source_link!: string
}

@ObjectType()
export class CalendarType implements Calendar {
  @Field((type) => ID)
  id!: string
  @Field()
  readonly name!: string
  @Field()
  readonly ics_filename!: string
  @Field()
  readonly source_link!: string
  @Field((type) => Int)
  readonly total_request?: number
  @Field((type) => Date)
  readonly updated_at!: Date
  @Field((type) => Date)
  readonly created_at!: number
}

@Table({ timestamps: true, updatedAt: 'updated_at', createdAt: 'created_at' })
export class CalendarModel extends Model<CalendarModel> implements Calendar {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  ics_filename!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  source_link!: string

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_request!: number
}
