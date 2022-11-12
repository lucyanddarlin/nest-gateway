import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  name: string

  @Column()
  systemId: number

  @Column({ type: 'text', default: null })
  description: string

  @CreateDateColumn({ name: 'create_time' })
  createTime: string

  @CreateDateColumn({ name: 'update_time' })
  updateTime: string
}
