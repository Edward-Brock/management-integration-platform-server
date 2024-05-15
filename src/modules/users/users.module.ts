import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { SettingsModule } from './settings/settings.module';
import { CaslGuard } from '../../middleware/guard/casl.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CaslAbilityFactory, CaslGuard, Logger],
  imports: [PrismaModule, SettingsModule],
  exports: [UsersService],
})
export class UsersModule {}
