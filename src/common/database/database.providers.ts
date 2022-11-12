import { getConfig } from '@/utils'
import { DataSource } from 'typeorm'
import * as path from 'path'
import { User } from '@/user-center/user/entities/user.mysql.entity'
import { Provider } from '@nestjs/common'
import { Role } from '@/user-center/role/entities/role.mysql.entity'
import { Privilege } from '@/user-center/privilege/entities/privilege.mysql.entity'
import { System } from '@/user-center/system/entities/system.mysql.entity'
import { UserRole } from '@/user-center/user-role/entities/user-role.mysql.entity'
import { RolePrivilege } from '@/user-center/role-privilege/entities/role-privilege.mysql.entity'
import { Resource } from '@/user-center/resource/entity/resource.mysql.entity'

const { MONGODB_CONFIG, MYSQL_CONFIG } = getConfig()

const MONGODB_DATABASE_CONFIG = {
  ...MONGODB_CONFIG,
  entities: [
    path.join(
      __dirname,
      `../../../**/*.${MONGODB_CONFIG.entities}.entity{.ts,.js}`,
    ),
  ],
}

const MYSQL_DATABASE_CONFIG = {
  ...MYSQL_CONFIG,
  entities: [User, Role, Privilege, System, UserRole, RolePrivilege, Resource],
}

const MONGODB_DATA_SOURCE = new DataSource(MONGODB_DATABASE_CONFIG)
const MYSQL_DATA_SOURCE = new DataSource(MYSQL_DATABASE_CONFIG)

export const DatabaseProviders: Provider[] = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    useFactory: async () => {
      await MONGODB_DATA_SOURCE.initialize()
      return MONGODB_DATA_SOURCE
    },
  },
  {
    provide: 'MYSQL_DATA_SOURCE',
    useFactory: async () => {
      if (!MYSQL_DATA_SOURCE.isInitialized) await MYSQL_DATA_SOURCE.initialize()
      return MYSQL_DATA_SOURCE
    },
  },
]
