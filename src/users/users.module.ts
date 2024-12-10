import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from '../auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../auth/services/tokens.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    JwtService,
    TokensService,
    DatabaseService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
