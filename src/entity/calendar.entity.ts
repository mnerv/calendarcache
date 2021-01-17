import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
  JoinTable,
} from 'typeorm'
import CalendarRequestLogsEntity from './calendar-activity.entity'

@Entity({ name: 'calendars' })
export default class CalendarEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, nullable: false })
  name!: string

  @Column({ unique: true, nullable: false })
  ics_filename!: string

  @Column({ unique: true, nullable: false })
  source_link!: string

  @Column({ default: 0 })
  total_requests!: number

  @OneToMany((type) => CalendarRequestLogsEntity, (log) => log.calendar)
  @JoinTable()
  requests!: CalendarRequestLogsEntity[]

  @Column({ nullable: true })
  cached_at!: Date

  @CreateDateColumn()
  created!: Date

  @UpdateDateColumn()
  updated!: Date

  constructor(name: string, ics_filename: string, source_link: string) {
    super()
    this.name = name
    this.ics_filename = ics_filename
    this.source_link = source_link
  }
}
