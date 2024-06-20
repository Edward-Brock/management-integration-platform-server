import { Module } from '@nestjs/common';
import { ManageService } from './manage.service';
import { ManageController } from './manage.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ManageController],
  providers: [ManageService],
  imports: [PrismaModule],
})
export class ManageModule {}
