import { getPaginationOptions } from '@/helper'
import { Inject, Injectable } from '@nestjs/common'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { In, Repository } from 'typeorm'
import { PrivilegeListWithPaginationDto } from './dto/privilege.dto'
import { Privilege } from './entities/privilege.mysql.entity'

@Injectable()
export class PrivilegeService {
  constructor(
    @Inject('PRIVILEGE_REPOSITORY')
    private privilegeRepository: Repository<Privilege>,
  ) {}

  async createOrUpdate(privilege: Privilege) {
    return await this.privilegeRepository.save(privilege)
  }

  async findById(id: number) {
    return await this.privilegeRepository.findOne({ where: { id } })
  }

  async findByIds(ids: number[]) {
    return await this.privilegeRepository.find({
      where: {
        id: In(ids),
      },
    })
  }

  async delete(id: number) {
    return await this.privilegeRepository.delete(id)
  }

  async paginate(
    searchParams: PrivilegeListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Privilege, CustomPaginationMeta>> {
    const queryBuilder =
      this.privilegeRepository.createQueryBuilder('privilege')
    queryBuilder.orderBy('privilege.createTime', 'DESC')
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere('privilege.name LIKE :name', {
        name: `%${searchParams.keyword}%`,
      })
    }

    return paginate<Privilege, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    )
  }
}
