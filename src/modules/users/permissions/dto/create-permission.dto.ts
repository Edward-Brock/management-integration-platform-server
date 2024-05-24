import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePermissionDto {
  id: string;
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(40)
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
