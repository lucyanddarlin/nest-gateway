import { BusinessException } from '@/common/filter/business.exception'
import { getPaginationOptions } from '@/helper'
import { Inject, Injectable } from '@nestjs/common'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Repository } from 'typeorm'
import {
  CreateResourceDto,
  ResourceListWithPaginationDto,
  UpdateResourceDto,
} from './dto/resource.dto'
import { Resource } from './entity/resource.mysql.entity'

@Injectable()
export class ResourceService {
  constructor(
    @Inject('RESOURCE_REPOSITORY')
    private resourceRepository: Repository<Resource>,
  ) {}

  async create(resource: CreateResourceDto) {
    const existResource = await this.findByKey(resource.key)
    if (existResource) {
      throw new BusinessException(`资源 Key ${resource.key} 已存在`)
    }
    return await this.resourceRepository.save(resource)
  }

  async update(resource: UpdateResourceDto) {
    const existResource = await this.findById(resource.id)
    if (!existResource) {
      throw new BusinessException(`未找到 ID 为 ${resource.id} 资源`)
    }
    const allowUpdateFields = {
      name: resource.name,
    }
    return await this.resourceRepository.save({
      ...existResource,
      ...allowUpdateFields,
    })
  }

  async delete(id: number) {
    return await this.resourceRepository.delete(id)
  }

  async findById(id) {
    return await this.resourceRepository.findOneBy(id)
  }

  async findByKey(key: string) {
    return await this.resourceRepository.findOne({
      where: {
        key,
      },
    })
  }

  async listBySystemId(systemId: number) {
    return await this.resourceRepository.find({
      where: {
        systemId,
      },
    })
  }

  async paginate(
    searchParams: ResourceListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Resource, CustomPaginationMeta>> {
    const queryBuilder = this.resourceRepository.createQueryBuilder('resource')
    queryBuilder.orderBy('resource.updateTime', 'DESC')
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere('resource.name LIKE :name', {
        name: `%${searchParams.keyword}%`,
      })
    }
    return paginate<Resource, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    )
  }
}
