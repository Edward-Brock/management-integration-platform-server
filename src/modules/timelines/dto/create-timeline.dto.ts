import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTimelineDto {
  id: string;
  @IsNotEmpty()
  content: string;
  @IsBoolean()
  @IsOptional()
  is_delete?: boolean;
  createdAt: Date;
  updatedAt: Date;
  @IsNotEmpty()
  userId: string;
}
