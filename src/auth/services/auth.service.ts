/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { TokensService } from './tokens.service';
import * as bcrypt from 'bcrypt';
import { messages } from '../../common/messages';
import { RequestUserDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return user;
    }
    return null;
  }

  async login(
    user: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { username: user.username, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
    });

    await this.tokensService.validateTokens(user.id, accessToken, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    const storedToken = await this.tokensService.findRefreshToken(refreshToken);

    if (!storedToken) {
      throw new Error(messages.REFRESH_TOKEN_NOT_FOUND);
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const newAccessToken = await this.jwtService.signAsync(
        { username: decoded.username, sub: decoded.sub },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
        },
      );

      await this.tokensService.saveTokens(
        decoded.sub,
        newAccessToken,
        refreshToken,
      );

      return { access_token: newAccessToken };
    } catch (err) {
      throw new Error(messages.INVALID_EXPIRED_REFRESH_TOKEN);
    }
  }

  async logout(requestUserDto: RequestUserDto): Promise<void> {
    await this.tokensService.deleteTokensByUserId(requestUserDto.id);
  }
}
