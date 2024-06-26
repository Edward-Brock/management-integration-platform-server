import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [PrismaModule],
  exports: [SettingsService],
})
export class SettingsModule {}
