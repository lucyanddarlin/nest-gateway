import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  name: string

  @Column()
  key: string

  @Column({ default: null })
  parentId?: number

  @Column()
  systemId: number

  @CreateDateColumn({ name: 'create_time' })
  createTime?: string

  @CreateDateColumn({ name: 'update_time' })
  updateTime?: string
}
