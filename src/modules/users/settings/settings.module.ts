import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, CaslAbilityFactory],
  imports: [PrismaModule],
  exports: [SettingsService],
})
export class SettingsModule {}
