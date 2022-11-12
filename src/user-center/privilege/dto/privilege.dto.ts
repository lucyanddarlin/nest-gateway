import { PaginationParams } from '@/types/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Action, PrivilegeStatus } from '../entities/privilege.mysql.entity'

export class CreatePrivilegeDto {
  @ApiProperty({ example: '2', description: '系统 ID' })
  @IsNotEmpty()
  systemId: number

  @IsNotEmpty()
  @ApiProperty({ example: '查看', description: '权限名称' })
  name: string

  @ApiProperty({ example: 'page', description: '类型' })
  @IsNotEmpty()
  resourceKey: string

  @ApiProperty({ example: '查看', description: '权限描述' })
  description?: string

  @ApiProperty({ example: 'read', enum: Action })
  @IsNotEmpty()
  action: string
}

export class DeletePrivilegeDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1', description: '权限ID' })
  privilegeId: number
}

export class RemovePrivilegeDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1', description: '权限ID' })
  privilegeId: number

  @IsNotEmpty()
  @ApiProperty({ example: '1', description: '权限状态', enum: PrivilegeStatus })
  status: number
}

export class UpdatePrivilegeDto extends CreatePrivilegeDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1', description: '权限ID' })
  id: number
}

export class PrivilegeListWithPaginationDto {
  @ApiProperty({ description: '查询关键词', example: '' })
  keyword?: string

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams
}

export class SetPrivilegeStatusDto {
  @ApiProperty({ description: '权限 ID', example: 1 })
  @IsNotEmpty()
  id: number

  @ApiProperty({ description: '权限状态', enum: PrivilegeStatus })
  @IsNotEmpty()
  status: number
}
