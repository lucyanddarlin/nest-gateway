import { BusinessException } from '@/common/filter/business.exception'
import { getPaginationOptions } from '@/helper'
import { Inject, Injectable } from '@nestjs/common'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { In, Repository } from 'typeorm'
import { RolePrivilegeService } from '../role-privilege/role-privilege.service'
import { CreateRoleDto, RoleListWithPaginationDto } from './dto/role.dto'
import { Role } from './entities/role.mysql.entity'

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY') private roleRepository: Repository<Role>,
    private readonly rolePrivilegeService: RolePrivilegeService,
  ) {}

  async createOrUpdateRole(role: CreateRoleDto) {
    return this.roleRepository.save(role)
  }

  async getRoleById(id: number) {
    const existRole = await this.roleRepository.findOne({
      where: { id },
    })
    if (!existRole) {
      throw new BusinessException(`未能找到 ID 为 ${id} 的角色`)
    }
    return existRole
  }

  async getRoles(ids: number[]) {
    return await this.roleRepository.find({
      where: {
        id: In(ids),
      },
    })
  }
  async delete(id: number) {
    await this.rolePrivilegeService.remove(id)
    return await this.roleRepository.delete(id)
  }

  async roleList(systemId: number) {
    const roles = await this.roleRepository.find({
      where: {
        systemId,
      },
    })
    return roles
  }

  async paginate(
    searchParams: RoleListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<Role, CustomPaginationMeta>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role')
    queryBuilder.orderBy('role.createTime', 'DESC')
    // keyword
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere('role.name LIKE :name', {
        name: `%${searchParams.keyword}%`,
      })
    }
    return paginate<Role, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    )
  }
}
