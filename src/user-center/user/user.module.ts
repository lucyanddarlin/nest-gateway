import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { FeishuController } from './feishu/feishu.controller'
import { FeishuService } from './feishu/feishu.service'
import { UserProvides } from './user.providers'
import { DatabaseModule } from '@/common/database/database.module'
import { RoleModule } from '../role/role.module'
import { PrivilegeModule } from '../privilege/privilege.module'
import { UserRoleModule } from '../user-role/user-role.module'
import { RolePrivilegeModule } from '../role-privilege/role-privilege.module'

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    RoleModule,
    PrivilegeModule,
    UserRoleModule,
    RolePrivilegeModule,
  ],
  controllers: [UserController, FeishuController],
  providers: [UserService, FeishuService, ...UserProvides],
  exports: [UserService, FeishuService],
})
export class UserModule {}
