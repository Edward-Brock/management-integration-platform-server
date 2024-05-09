import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { SettingsModule } from './settings/settings.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CaslAbilityFactory],
  imports: [PrismaModule, SettingsModule],
  exports: [UsersService],
})
export class UsersModule {}
