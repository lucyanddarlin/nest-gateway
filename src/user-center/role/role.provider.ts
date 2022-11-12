import { Provider } from '@nestjs/common'
import { Role } from './entities/role.mysql.entity'

export const RoleProviders: Provider[] = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Role),
    inject: ['MYSQL_DATA_SOURCE'],
  },
]
