import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  value?: string;
  @IsBoolean()
  autoload: boolean;
}
