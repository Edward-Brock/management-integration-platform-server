import { User } from '@prisma/client';
import { BaseEntity } from '../../../common/entities/base.entity';

export class UserEntity extends BaseEntity implements User {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  language: string;
}
