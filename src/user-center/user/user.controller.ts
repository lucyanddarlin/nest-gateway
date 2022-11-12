import { Controller, Get, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PayloadUser } from '@/helper'
import {
  GetRolesByIdDto,
  SetRolesDto,
  SetUserStatusDto,
  UserListWithPaginationDto,
} from './dto/user.dto'
import { UserRoleService } from '../user-role/user-role.service'

@ApiTags('用户')
@Controller({
  path: 'user',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: '用户信息' })
  @Get('profile')
  getUserProfile(@PayloadUser() user: PayLoad) {
    return this.userService.profile(user.userId)
  }

  @ApiOperation({ summary: '设置用户状态' })
  @Post('changeStatus')
  async setUserStatus(@Body() body: SetUserStatusDto) {
    const existUser = await this.userService.getUserById(body.userId)
    return this.userService.createOrUpdateUser({
      ...existUser,
      status: body.status,
    })
  }

  @ApiOperation({ summary: '用户分页' })
  @Post('list/pagination')
  async listWithPagination(@Body() paginationDto: UserListWithPaginationDto) {
    const { page, ...searchParams } = paginationDto
    return await this.userService.paginate(searchParams, page)
  }

  @ApiOperation({ summary: '通过用户 ID 获取角色列表' })
  @Post('roles/list')
  getRolesById(@Body() getRolesDto: GetRolesByIdDto) {
    return this.userService.getRoleById(
      getRolesDto.userId,
      getRolesDto.systemId,
    )
  }

  @ApiOperation({ summary: '设置用户角色' })
  @Post('role/set')
  async setRoles(@Body() { userId, roleIds, systemId }: SetRolesDto) {
    return await this.userRoleService.setUserRoles(userId, roleIds, systemId)
  }
}
