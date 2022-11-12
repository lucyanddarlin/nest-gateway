import { DatabaseModule } from '@/common/database/database.module'
import { Module } from '@nestjs/common'
import { rolePrivilegeProviders } from './role-privilege.providers'
import { RolePrivilegeService } from './role-privilege.service'

@Module({
  imports: [DatabaseModule],
  providers: [RolePrivilegeService, ...rolePrivilegeProviders],
  exports: [RolePrivilegeService],
})
export class RolePrivilegeModule {}
