import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RoleEntity implements Role {
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
