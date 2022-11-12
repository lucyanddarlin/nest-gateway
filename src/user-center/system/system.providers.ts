import { Provider } from '@nestjs/common'
import { System } from './entities/system.mysql.entity'

export const systemProviders: Provider[] = [
  {
    provide: 'SYSTEM_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(System),
    inject: ['MYSQL_DATA_SOURCE'],
  },
]
