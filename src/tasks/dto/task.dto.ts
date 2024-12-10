import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  description: string;

  @IsOptional()
  @IsUUID()
  @IsString()
  user_id: string;

  @IsOptional()
  start_date: string;

  @IsOptional()
  end_date: string;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
