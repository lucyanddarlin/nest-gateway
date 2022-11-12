import { BusinessException } from '@/common/filter/business.exception'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ResourceService } from '../resource/resource.service'
import { SystemService } from '../system/system.service'
import {
  CreatePrivilegeDto,
  DeletePrivilegeDto,
  PrivilegeListWithPaginationDto,
  SetPrivilegeStatusDto,
  UpdatePrivilegeDto,
} from './dto/privilege.dto'
import { Privilege } from './entities/privilege.mysql.entity'
import { PrivilegeService } from './privilege.service'

@ApiTags('权限')
@Controller('privilege')
export class PrivilegeController {
  constructor(
    private readonly privilegeService: PrivilegeService,
    private readonly resourceService: ResourceService,
    private readonly systemService: SystemService,
  ) {}

  @ApiOperation({ summary: '创建权限' })
  @Post('create')
  async create(@Body() dto: CreatePrivilegeDto) {
    const privilege: Privilege = {
      systemId: dto.systemId,
      name: dto.name,
      resourceKey: dto.resourceKey,
      action: dto.action,
      description: dto.description,
    }
    const existResource = await this.resourceService.findByKey(
      privilege.resourceKey,
    )
    if (!existResource) {
      throw new BusinessException(`未找到资源 Key ${privilege.resourceKey}`)
    }
    return await this.privilegeService.createOrUpdate(dto)
  }

  @ApiOperation({ summary: '修改权限' })
  @Post('update')
  async update(@Body() dto: UpdatePrivilegeDto) {
    const privilege: Privilege = {
      systemId: dto.systemId,
      name: dto.name,
      resourceKey: dto.resourceKey,
      action: dto.action,
      description: dto.description,
    }
    const existPrivilege = await this.privilegeService.findById(dto.id)
    if (!existPrivilege) {
      throw new BusinessException(`未找到 ID 为 ${dto.id} 的权限`)
    }
    const existResource = await this.resourceService.findByKey(
      privilege.resourceKey,
    )
    if (!existResource) {
      throw new BusinessException(`未找到资源 Key ${privilege.resourceKey}`)
    }
    return await this.privilegeService.createOrUpdate({
      ...existPrivilege,
      ...privilege,
    })
  }

  @ApiOperation({ summary: '修改权限状态' })
  @Post('status/set')
  async changeStatus(@Body() dto: SetPrivilegeStatusDto) {
    const existPrivilege = await this.privilegeService.findById(dto.id)
    if (!existPrivilege) {
      throw new BusinessException(`未找到 ID 为 ${dto.id} 的权限`)
    }
    return await this.privilegeService.createOrUpdate({
      ...existPrivilege,
      status: dto.status,
    })
  }

  @ApiOperation({ summary: '删除权限' })
  @Post('delete')
  async delete(@Body() dto: DeletePrivilegeDto) {
    return this.privilegeService.delete(dto.privilegeId)
  }

  @ApiOperation({
    summary: '权限列表（分页）',
    description: '根据权限名称查询',
  })
  @Post('list/pagination')
  async paginate(@Body() dto: PrivilegeListWithPaginationDto) {
    const { page, ...searchParams } = dto

    const pageData = await this.privilegeService.paginate(searchParams, page)
    const systemIds = pageData.items.map((privilege) => privilege.systemId)
    const systemList = await this.systemService.findByIds(systemIds)
    const systemMap = {}
    systemList.forEach((system) => (systemMap[system.id] = system))
    const newPrivilege = pageData.items.map((privilege) => {
      privilege['systemName'] = systemMap[privilege.systemId].name
      return privilege
    })
    return { ...pageData, items: newPrivilege }
  }
}
