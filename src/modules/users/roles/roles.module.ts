import { Logger, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService, Logger],
  imports: [PrismaModule],
  exports: [RolesService],
})
export class RolesModule {}
