import { DatabaseModule } from '@/common/database/database.module'
import { Module } from '@nestjs/common'
import { userRoleProviders } from './user-role.providers'
import { UserRoleService } from './user-role.service'

@Module({
  imports: [DatabaseModule],
  providers: [UserRoleService, ...userRoleProviders],
  exports: [UserRoleService],
})
export class UserRoleModule {}
