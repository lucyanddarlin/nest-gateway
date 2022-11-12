import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  CreateResourceDto,
  DeleteResourceDto,
  ListBySystemIdDto,
  UpdateResourceDto,
} from './dto/resource.dto'
import { ResourceService } from './resource.service'

@ApiTags('资源')
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @ApiOperation({ summary: '创建新资源' })
  @Post('create')
  async create(@Body() dto: CreateResourceDto) {
    return await this.resourceService.create(dto)
  }

  @ApiOperation({ summary: '修改资源信息' })
  @Post('update')
  async update(@Body() dto: UpdateResourceDto) {
    return await this.resourceService.findById(dto.id)
  }

  @ApiOperation({ summary: ' 删除资源' })
  @Post('delete')
  async delete(@Body() dto: DeleteResourceDto) {
    return await this.resourceService.delete(dto.id)
  }

  @ApiOperation({ summary: '资源列表', description: '根据系统 ID 查询' })
  @Post('list/systemid')
  async listBySystemId(@Body() dto: ListBySystemIdDto) {
    return await this.resourceService.listBySystemId(dto.systemId)
  }
}
