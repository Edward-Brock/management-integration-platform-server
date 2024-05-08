import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CaslAbilityFactory],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
