import {
  IsDate,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  id: number;
  name?: string;
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;
  @IsEmail()
  email?: string;
  @IsMobilePhone()
  mobile?: string;
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(36)
  password: string;
  @IsString()
  avatar?: string;
  @IsString()
  language: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
}
