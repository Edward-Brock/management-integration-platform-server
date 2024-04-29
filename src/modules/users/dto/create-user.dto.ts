import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserStatusEnum } from '../enum/user-status.enum';

export class CreateUserDto {
  id: number;
  uid: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsMobilePhone()
  mobile?: string;
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(36)
  password: string;
  @IsOptional()
  @IsString()
  avatar?: string;
  @IsOptional()
  @IsString()
  language: string;
  @IsNotEmpty()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
