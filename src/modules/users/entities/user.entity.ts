import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty()
  id: number;
  @ApiProperty({ required: false, nullable: true })
  name: string;
  @ApiProperty()
  username: string;
  @ApiProperty({ required: false, nullable: true })
  email: string;
  @ApiProperty()
  mobile: string;
  @ApiProperty()
  password: string;
  @ApiProperty({ required: false, nullable: true })
  avatar: string;
  @ApiProperty({ default: 'zh-cn' })
  language: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
