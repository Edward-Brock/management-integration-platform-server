import { Timeline } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TimelineEntity implements Timeline {
  id: string;
  @ApiProperty()
  content: string;
  @ApiProperty({ default: false })
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
