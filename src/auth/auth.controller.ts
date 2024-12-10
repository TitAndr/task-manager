import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Public } from './decorators/public.decorator';
import { messages } from '../common/messages';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const { username, password } = authDto;

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException(messages.INVALID_USER_CREDENTIONALS);
    }

    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const token = await this.authService.refreshAccessToken(
      refreshTokenDto.refresh_token,
    );

    if (!token) {
      throw new UnauthorizedException(messages.INVALID_EXPIRED_REFRESH_TOKEN);
    }

    return token;
  }

  @Post('logout')
  signOut(@Request() req: any) {
    this.authService.logout(req.user);
  }
}
