import { BusinessException } from '@/common/filter/business.exception'
import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { UpdateSystemDto } from './dto/system.dto'
import { System } from './entities/system.mysql.entity'

@Injectable()
export class SystemService {
  constructor(
    @Inject('SYSTEM_REPOSITORY') private systemRepository: Repository<System>,
  ) {}

  async create(system: System) {
    return await this.systemRepository.save(system)
  }

  async update(system: UpdateSystemDto) {
    const existSystem = this.findById(system.id)
    if (!existSystem) {
      throw new BusinessException(`未找到 ID 为 ${system.id} 的系统`)
    }
    return await this.systemRepository.save({ ...existSystem, ...system })
  }

  async findById(id: number) {
    return await this.systemRepository.findOne({ where: { id } })
  }

  async findByIds(ids: number[]) {
    return await this.systemRepository.find({
      where: {
        id: In(ids),
      },
    })
  }

  async remove(id: number) {
    return await this.systemRepository.delete(id)
  }

  async list() {
    return await this.systemRepository.find()
  }
}
