import { Permission } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionEntity implements Permission {
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  description: string;
}
