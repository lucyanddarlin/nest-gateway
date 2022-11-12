import { Provider } from '@nestjs/common'
import { Privilege } from './entities/privilege.mysql.entity'

export const privilegeProviders: Provider[] = [
  {
    provide: 'PRIVILEGE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Privilege),
    inject: ['MYSQL_DATA_SOURCE'],
  },
]
