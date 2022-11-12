import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  name: string

  @Column({ type: 'text', default: null })
  description?: string

  @Column()
  creatorName?: string

  @Column()
  creatorId?: number

  @CreateDateColumn({ name: 'create_time' })
  createTime?: string

  @UpdateDateColumn({ name: 'update_time' })
  updateTime?: string
}
