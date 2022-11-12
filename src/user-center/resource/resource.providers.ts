import { Provider } from '@nestjs/common'
import { Resource } from './entity/resource.mysql.entity'

export const ResourceProviders: Provider[] = [
  {
    provide: 'RESOURCE_REPOSITORY',
    useFactory: (AppDataSource) => AppDataSource.getRepository(Resource),
    inject: ['MYSQL_DATA_SOURCE'],
  },
]
