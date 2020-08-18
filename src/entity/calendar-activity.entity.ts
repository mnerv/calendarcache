import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  BaseEntity,
  JoinTable,
} from 'typeorm'
import CalendarEntity from './calendar.entity'

@Entity({ name: 'calendar_request_logs' })
export default class CalendarRequestLogsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ comment: 'Is the requested data cached or new' })
  cached_request!: boolean

  @Column({ nullable: true, comment: 'Is the server down' })
  fetch_failed?: boolean

  @ManyToOne((type) => CalendarEntity, (calendar) => calendar.requests)
  @JoinColumn({ name: 'calendar_id' })
  @JoinTable()
  calendar!: CalendarEntity

  @CreateDateColumn()
  created!: Date
}
