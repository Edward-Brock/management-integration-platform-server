import { BaseEntity } from '../../../common/entities/base.entity';

export class CreateUserDto extends BaseEntity {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  language: string;
}
