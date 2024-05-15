import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CaslGuard } from '../../middleware/guard/casl.guard';

@Module({
  controllers: [OptionsController],
  providers: [OptionsService, CaslAbilityFactory, CaslGuard],
  imports: [PrismaModule],
})
export class OptionsModule {}
