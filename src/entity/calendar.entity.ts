import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { CalendarURLType } from '../model/calendar.model'

@Entity({ name: 'calendars' })
export class CalendarEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, nullable: false })
  name!: string

  @Column({ unique: true, nullable: false })
  filename!: string

  @Column({ unique: true, nullable: false })
  source!: string

  @Column({ nullable: false })
  url_type!: CalendarURLType

  @Column({ default: 0 })
  requests!: number

  @Column({ nullable: true })
  cached_at!: Date

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
