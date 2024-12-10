import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TaskDetailDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  additional_info: string;
}
