import { Module } from '@nestjs/common'
import { PrivilegeService } from './privilege.service'
import { PrivilegeController } from './privilege.controller'
import { DatabaseModule } from '@/common/database/database.module'
import { privilegeProviders } from './privilege.provider'
import { ResourceModule } from '../resource/resource.module'
import { SystemModule } from '../system/system.module'

@Module({
  imports: [DatabaseModule, ResourceModule, SystemModule],
  controllers: [PrivilegeController],
  providers: [PrivilegeService, ...privilegeProviders],
  exports: [PrivilegeService],
})
export class PrivilegeModule {}
