import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [OptionsController],
  providers: [OptionsService],
  imports: [PrismaModule],
})
export class OptionsModule {}
