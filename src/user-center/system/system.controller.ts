import { PayloadUser } from '@/helper'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  CreateSystemDto,
  DeleteSystemDto,
  UpdateSystemDto,
} from './dto/system.dto'
import { SystemService } from './system.service'

@ApiTags('系统')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @ApiOperation({ summary: '创建系统' })
  @Post('create')
  async create(@Body() dto: CreateSystemDto, @PayloadUser() user: PayLoad) {
    return await this.systemService.create({
      ...dto,
      creatorName: user.name,
      creatorId: user.userId,
    })
  }

  @ApiOperation({ summary: '修改系统信息' })
  @Post('update')
  async update(@Body() dto: UpdateSystemDto) {
    return await this.systemService.update(dto)
  }

  @ApiOperation({ summary: '删除系统' })
  @Post('delete')
  async delete(@Body() dto: DeleteSystemDto) {
    return await this.systemService.remove(dto.id)
  }

  @ApiOperation({ summary: '获取系统列表' })
  @Post('list')
  async list() {
    return await this.systemService.list()
  }
}
