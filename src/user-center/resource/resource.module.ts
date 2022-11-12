import { Module } from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ResourceController } from './resource.controller'
import { DatabaseModule } from '@/common/database/database.module'
import { ResourceProviders } from './resource.providers'

@Module({
  imports: [DatabaseModule],
  controllers: [ResourceController],
  providers: [ResourceService, ...ResourceProviders],
  exports: [ResourceService],
})
export class ResourceModule {}
