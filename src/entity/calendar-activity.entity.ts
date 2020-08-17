import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  BaseEntity,
} from 'typeorm'
import CalendarEntity from './calendar.entity'

@Entity({ name: 'calendar_request_logs' })
export default class CalendarRequestLogsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  cached_request!: boolean

  @ManyToOne((type) => CalendarEntity, (calendar) => calendar.requests)
  @JoinColumn({ name: 'calendar_id' })
  calendar!: CalendarEntity

  @CreateDateColumn()
  created!: Date
}
