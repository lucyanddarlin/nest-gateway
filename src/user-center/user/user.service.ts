import { BusinessException } from '@/common/filter/business.exception'
import { Inject, Injectable } from '@nestjs/common'
import { In, MongoRepository } from 'typeorm'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { UserListWithPaginationDto } from './dto/user.dto'
import { User } from './entities/user.mysql.entity'
import { FeishuUserInfo } from './feishu/feishu.dto'
import { isNotEmpty } from 'class-validator'
import { getPaginationOptions } from '@/helper'
import { UserRoleService } from '../user-role/user-role.service'
import { RolePrivilegeService } from '../role-privilege/role-privilege.service'
import { PrivilegeService } from '../privilege/privilege.service'
import { RoleService } from '../role/role.service'

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: MongoRepository<User>,
    private readonly roleService: RoleService,
    private readonly privilegeService: PrivilegeService,
    private readonly userRoleService: UserRoleService,
    private readonly rolePrivilegeService: RolePrivilegeService,
  ) {}

  async createOrUpdateUser(user: User) {
    return await this.userRepository.save(user)
  }

  async createOrUpdateByFeishu(feishuInfo: FeishuUserInfo) {
    const findUser: User = await this.userRepository.findOne({
      where: [{ email: feishuInfo.email }],
    })
    return await this.userRepository.save({ ...findUser, ...feishuInfo })
  }

  async profile(userId: number) {
    return await this.userRepository.findOneBy(userId)
  }

  async getUserById(id: number): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: { id },
    })
    if (!existUser) {
      throw new BusinessException(`未找到 feiShuId 为 ${id} 的用户`)
    }
    return existUser
  }

  async getUserByFeiShuId(feishuUserId: string): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: { feishuUserId },
    })
    if (!existUser) {
      throw new BusinessException(
        `未找到 feishuUserId 为 ${feishuUserId} 的用户`,
      )
    }
    return existUser
  }

  async getUserListByEmails(emailList: string[]) {
    return await this.userRepository.find({
      where: {
        email: In(emailList),
      },
    })
  }

  // 获取用户角色列表
  async getRoleById(userId: number, systemId: number) {
    const userRoleList = await this.userRoleService.listByUserId(
      userId,
      systemId,
    )
    const roleIds = userRoleList.map((ur) => ur.id)
    return await this.roleService.getRoles(roleIds)
  }

  // 获取用户权限列表
  async getPrivilegeListByUserId(userId: number, systemId: number) {
    const userRoleList = await this.userRoleService.listByUserId(
      userId,
      systemId,
    )
    const roleIds = userRoleList.map((ur) => ur.id)
    const rolePrivilegeList = await this.rolePrivilegeService.listByRoleIds(
      roleIds,
    )
    const privilegeIds = rolePrivilegeList.map((rp) => rp.id)
    const privilegeList = await this.privilegeService.findByIds([
      ...new Set(privilegeIds),
    ])
    return privilegeList
  }

  async getPrivilegeCodeByUserId(userId: number, systemId: number) {
    const userRoleList = await this.userRoleService.listByUserId(
      userId,
      systemId,
    )
    const roleIds = userRoleList.map((ur) => ur.id)
    const rolePrivilegeList = await this.rolePrivilegeService.listByRoleIds(
      roleIds,
    )
    const privilegeIds = rolePrivilegeList.map((rp) => rp.id)
    const privilegeList = await this.privilegeService.findByIds([
      ...new Set(privilegeIds),
    ])

    return privilegeList.map((p) => ({
      code: `${p.resourceKey}:${p.action}`,
      status: p.status,
    }))
  }

  async paginate(
    searchParams: UserListWithPaginationDto,
    page: PaginationParams,
  ): Promise<Pagination<User, CustomPaginationMeta>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
    queryBuilder.orderBy('user.updateTime', 'DESC')
    if (isNotEmpty(searchParams.keyword)) {
      queryBuilder.andWhere('user.name LIKE :name', {
        name: `%${searchParams.keyword}`,
      })
      queryBuilder.orWhere('user.name LIKE :name', {
        name: `%${searchParams.keyword}`,
      })
    }
    return paginate<User, CustomPaginationMeta>(
      queryBuilder,
      getPaginationOptions(page),
    )
  }
}
