import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { RolePrivilege } from './entities/role-privilege.mysql.entity'

@Injectable()
export class RolePrivilegeService {
  constructor(
    @Inject('ROLE_PRIVILEGE_REPOSITORY')
    private rolePrivilegeRepository: Repository<RolePrivilege>,
  ) {}

  async set(roleId: number, privilegeIds: number[], systemId: number) {
    await this.remove(roleId)
    const rolePrivilege: RolePrivilege[] = privilegeIds.map((privilegeId) => {
      return {
        roleId,
        privilegeId,
        systemId,
      }
    })
    // TODO: 判断 privilege 是否存在
    return await this.rolePrivilegeRepository.save(rolePrivilege)
  }

  async remove(roleId: number) {
    return await this.rolePrivilegeRepository.delete({
      roleId,
    })
  }

  async listByRoleIds(roleIds: number[]) {
    return await this.rolePrivilegeRepository.find({
      where: {
        roleId: In(roleIds),
      },
    })
  }
}
