import { Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UserRole } from './entities/user-role.mysql.entity'

@Injectable()
export class UserRoleService {
  constructor(
    @Inject('USER_ROLE_REPOSITORY')
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async listByUserId(userId: number, systemId: number) {
    return await this.userRoleRepository.find({
      where: {
        userId,
        systemId,
      },
    })
  }

  async deleteByUserId(userId: number, systemId: number) {
    return await this.userRoleRepository.delete({
      userId,
      systemId,
    })
  }

  async setUserRoles(userId: number, roleIds: number[], systemId: number) {
    const userRoles: UserRole[] = roleIds.map((roleId) => {
      return {
        userId,
        systemId,
        roleId,
      }
    })
    // TODO: 检查角色是否存在
    await this.deleteByUserId(userId, systemId)
    return await this.userRoleRepository.save(userRoles)
  }
}
