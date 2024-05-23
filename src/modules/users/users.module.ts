import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsModule } from './settings/settings.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Logger],
  imports: [PrismaModule, SettingsModule, PermissionsModule],
  exports: [UsersService],
})
export class UsersModule {}
