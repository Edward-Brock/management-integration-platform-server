import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatusEnum } from '../enum/user-status.enum';

export class UserEntity implements User {
  id: number;
  uid: string;
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
  @ApiProperty({ default: 'ACTIVE' })
  status: UserStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
