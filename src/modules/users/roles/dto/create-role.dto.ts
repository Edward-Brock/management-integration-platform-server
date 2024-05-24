import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  id: string;
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
