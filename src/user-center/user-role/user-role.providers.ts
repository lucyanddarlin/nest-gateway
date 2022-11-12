import { Provider } from '@nestjs/common'
import { UserRole } from './entities/user-role.mysql.entity'

export const userRoleProviders: Provider[] = [
  {
    provide: 'USER_ROLE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(UserRole),
    inject: ['MYSQL_DATA_SOURCE'],
  },
]
