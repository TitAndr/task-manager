import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

export class AccessTokenDto {
  @IsNotEmpty()
  @IsString()
  access_token: string;
}
