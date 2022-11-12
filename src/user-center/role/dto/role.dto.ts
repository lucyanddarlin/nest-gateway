import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { PaginationParams } from '@/types/types'

export class CreateRoleDto {
  @ApiProperty({ example: '普通用户', description: '角色名称' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: '普通用户的权限', description: '角色描述' })
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: 2, description: '系统 ID' })
  @IsNotEmpty()
  systemId: number
}

export class UpdateRoleDto extends CreateRoleDto {
  @IsNotEmpty()
  @ApiProperty({ description: '角色 ID', example: '1' })
  id: number
}

export class RemoveRoleDto {
  @ApiProperty({ example: '1', description: '角色 ID' })
  id: number
}

export class GetPrivilegeListByIdDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  roleId: number
}

export class RoleListDto {
  @ApiProperty({ description: '系统 ID', example: '1' })
  @IsNotEmpty()
  systemId: number
}

export class RoleListWithPaginationDto {
  @ApiProperty({ description: '查询关键词', example: '' })
  keyword?: string

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams
}

export class RolePrivilegeSetDto {
  @ApiProperty({ description: '角色 ID', example: 1 })
  @IsNotEmpty()
  roleId: number

  @IsNotEmpty()
  privilegeIds: number[]

  @ApiProperty({ description: '系统 ID', example: 2 })
  @IsNotEmpty()
  systemId: number
}
