import { Provider } from '@nestjs/common'
import { RolePrivilege } from './entities/role-privilege.mysql.entity'

export const rolePrivilegeProviders: Provider[] = [
  {
    provide: 'ROLE_PRIVILEGE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(RolePrivilege),
    inject: ['MYSQL_DATA_SOURCE'],
  },
]
