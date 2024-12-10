import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TokensService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async saveTokens(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    await this.pool.query(
      'INSERT INTO tokens (user_id, access_token, refresh_token) VALUES ($1, $2, $3)',
      [userId, accessToken, refreshToken],
    );
  }

  async findAccessToken(accessToken: string): Promise<any> {
    const result = await this.pool.query(
      'SELECT * FROM tokens WHERE access_token = $1',
      [accessToken],
    );
    return result.rows[0];
  }

  async findRefreshToken(refreshToken: string): Promise<any> {
    const result = await this.pool.query(
      'SELECT * FROM tokens WHERE refresh_token = $1',
      [refreshToken],
    );
    return result.rows[0];
  }

  async findUserTokens(userId: string): Promise<any> {
    const result = await this.pool.query(
      'SELECT * FROM tokens WHERE user_id = $1',
      [userId],
    );
    return result.rows[0];
  }

  async deleteTokensByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM tokens WHERE user_id = $1', [userId]);
  }

  async validateTokens(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const userTokens = await this.findUserTokens(userId);

    if (userTokens) {
      // remove all existing tokens for current user
      await this.deleteTokensByUserId(userId);
    }

    // save new single tokens
    await this.saveTokens(userId, accessToken, refreshToken);
  }
}
