import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  password: string;

  @IsOptional()
  @IsUUID()
  @IsString()
  id: string;
}

export class RequestUserDto extends PartialType(AuthDto) {}
