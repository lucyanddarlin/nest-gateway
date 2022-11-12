import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { PaginationParams } from '@/types/types'
import {} from '@nestjs/common'

export class CreateResourceDto {
  @ApiProperty({ description: '资源信息', example: 'test' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '父级资源 ID' })
  parentId?: number

  @ApiProperty({ description: '系统 ID', example: '2' })
  @IsNotEmpty()
  systemId: number

  @ApiProperty({ description: '系统标识', example: 'test' })
  key: string
}

export class UpdateResourceDto extends CreateResourceDto {
  @ApiProperty({ description: '资源 ID', example: 1 })
  @IsNotEmpty()
  id: number
}

export class ResourceListWithPaginationDto {
  @ApiProperty({ example: '', description: '查询关键词' })
  keyword?: string

  @ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
  page?: PaginationParams
}

export class DeleteResourceDto {
  @ApiProperty({ description: '资源 ID', example: 1 })
  @IsNotEmpty()
  id: number
}

export class ListBySystemIdDto {
  @ApiProperty({ description: '系统 ID', example: 2 })
  @IsNotEmpty()
  systemId: number
}
