import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  id: number;
  @IsNotEmpty()
  @IsString()
  name: string;
  value?: string;
}
