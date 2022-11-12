import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PrivilegeService } from '../privilege/privilege.service'
import { RolePrivilegeService } from '../role-privilege/role-privilege.service'
import { SystemService } from '../system/system.service'
import {
  CreateRoleDto,
  GetPrivilegeListByIdDto,
  RemoveRoleDto,
  RoleListDto,
  RoleListWithPaginationDto,
  RolePrivilegeSetDto,
  UpdateRoleDto,
} from './dto/role.dto'
import { RoleService } from './role.service'

@ApiTags('角色')
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly rolePrivilegeService: RolePrivilegeService,
    private readonly privilegeService: PrivilegeService,
    private readonly systemService: SystemService,
  ) {}

  @ApiOperation({ summary: '创建新角色' })
  @Post('create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createOrUpdateRole(createRoleDto)
  }

  @ApiOperation({ summary: '修改角色信息' })
  @Post('update')
  async update(@Body() updateRoleDto: UpdateRoleDto) {
    const existRole = await this.roleService.getRoleById(updateRoleDto.id)
    return await this.roleService.createOrUpdateRole({
      ...existRole,
      ...updateRoleDto,
    })
  }

  @ApiOperation({
    summary: '删除角色',
    description: '如果发现角色有绑定权限，权限将同步删除 role-privilege 关系表',
  })
  @Post('/delete')
  async delete(@Body() deleteRoleDto: RemoveRoleDto) {
    return await this.roleService.delete(deleteRoleDto.id)
  }

  @ApiOperation({
    summary: '角色列表',
    description: '根据系统返回对应系统的角色列表',
  })
  @Post('list')
  async list(@Body() roleListDto: RoleListDto) {
    return await this.roleService.roleList(roleListDto.systemId)
  }

  @ApiOperation({ summary: '查询权限', description: '根据角色 ID 查询权限' })
  @Post('privilege')
  async getPrivilegeListById(@Body() dto: GetPrivilegeListByIdDto) {
    const rolePrivilegeList = await this.rolePrivilegeService.listByRoleIds([
      dto.roleId,
    ])
    const privilegeList = await this.privilegeService.findByIds(
      rolePrivilegeList.map((rp) => rp.privilegeId),
    )
    return privilegeList
  }

  @ApiOperation({
    summary: '角色列表（分页）',
    description: '根据角色名称查询',
  })
  @Post('list/paginate')
  async roleListWithPagination(@Body() dto: RoleListWithPaginationDto) {
    const { page, ...searchParams } = dto
    const pageData = await this.roleService.paginate(searchParams, page)
    const systemIds = pageData.items.map((role) => role.systemId)
    const systemList = await this.systemService.findByIds(systemIds)
    const systemMap = {}
    systemList.forEach((system) => (systemMap[system.id] = system))
    const newRoles = pageData.items.map((role) => {
      role['systemName'] = systemMap[role.systemId].name
      return role
    })
    return { ...pageData, items: newRoles }
  }

  @ApiOperation({ summary: '角色分配权限' })
  @Post('privilege/set')
  async setPrivilege(@Body() dto: RolePrivilegeSetDto) {
    return await this.rolePrivilegeService.set(
      dto.roleId,
      dto.privilegeIds,
      dto.systemId,
    )
  }
}
