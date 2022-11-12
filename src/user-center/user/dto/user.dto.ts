import { PaginationParams } from '@/types/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { UserStatus } from '../entities/user.mysql.entity'

class RawDto {
  @ApiProperty({ description: '用户 ID', example: 1 })
  @IsNotEmpty()
  userId: number

  @ApiProperty({ description: '系统 ID', example: 2 })
  @IsNotEmpty()
  systemId: number
}

export class SetUserStatusDto {
  @ApiProperty({ example: 1, description: '用户 ID' })
  @IsNotEmpty()
  userId: number

  @ApiProperty({ example: 1, description: '用户状态', enum: UserStatus })
  @IsNotEmpty()
  status: number
}

export class UserListWithPaginationDto {
  @ApiProperty({ description: '查询关键词', example: '' })
  keyword?: string

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams
}

export class GetRolesByIdDto extends RawDto {}

export class SetRolesDto extends RawDto {
  @ApiProperty({ description: '角色 ID', example: [1] })
  @IsNotEmpty()
  roleIds: number[]
}
