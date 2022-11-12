import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { getConfig } from '@/utils'
import { UserModule } from './user-center/user/user.module'
import { AuthModule } from './auth/auth.module'
import * as redisStore from 'cache-manager-redis-store'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { UserRoleModule } from './user-center/user-role/user-role.module'
import { RoleModule } from './user-center/role/role.module'
import { SystemModule } from './user-center/system/system.module'
import { RolePrivilegeModule } from './user-center/role-privilege/role-privilege.module'
import { PrivilegeModule } from './user-center/privilege/privilege.module'
import { ResourceModule } from './user-center/resource/resource.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: getConfig('REDIS_CONFIG').host,
      port: getConfig('REDIS_CONFIG').port,
      auth_pass: getConfig('REDIS_CONFIG').auth,
      db: getConfig('REDIS_CONFIG').db,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    UserModule,
    AuthModule,
    UserRoleModule,
    RoleModule,
    SystemModule,
    RolePrivilegeModule,
    PrivilegeModule,
    ResourceModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
