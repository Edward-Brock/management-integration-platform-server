import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  id: number;
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
  createdAt: Date;
  updatedAt: Date;
}
