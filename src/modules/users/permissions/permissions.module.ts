import { Logger, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, Logger],
  imports: [PrismaModule],
  exports: [PermissionsService],
})
export class PermissionsModule {}
