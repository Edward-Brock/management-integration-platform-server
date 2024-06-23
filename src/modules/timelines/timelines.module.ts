import { Module } from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { TimelinesController } from './timelines.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TimelinesController],
  providers: [TimelinesService],
  imports: [PrismaModule],
  exports: [TimelinesService],
})
export class TimelinesModule {}
