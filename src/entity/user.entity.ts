import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column({ nullable: false })
  username!: string

  @Column({ nullable: false })
  password!: string
}
