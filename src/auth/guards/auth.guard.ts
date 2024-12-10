/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../services/tokens.service';
import { messages } from '../../common/messages';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // check public role
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // validate tokens
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.split(' ')[1];
      return this.validateAccessToken(accessToken, request);
    }

    const refreshToken =
      request.body.refresh_token || request.query.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException(messages.MISSING_TOKENS);
    }

    return this.validateRefreshToken(refreshToken, request);
  }

  private async validateAccessToken(
    token: string,
    request: any,
  ): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const storedToken = await this.tokensService.findAccessToken(token);

      if (!storedToken) {
        throw new UnauthorizedException(messages.ACCESS_TOKEN_MISSED);
      }

      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException(messages.INVALID_EXPIRED_ACCESS_TOKEN);
    }
  }

  private async validateRefreshToken(
    token: string,
    request: any,
  ): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const storedToken = await this.tokensService.findRefreshToken(token);

      if (!storedToken) {
        throw new UnauthorizedException(messages.REFRESH_TOKEN_MISSED);
      }

      const newAccessToken = this.jwtService.sign(
        { username: decoded.username, sub: decoded.sub },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
        },
      );

      await this.tokensService.saveTokens(decoded.sub, newAccessToken, token);

      request.user = decoded;
      request.newAccessToken = newAccessToken;
      return true;
    } catch (err) {
      throw new UnauthorizedException(messages.INVALID_EXPIRED_REFRESH_TOKEN);
    }
  }
}
