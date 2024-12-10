import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseService } from '../database/database.service';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: () => {
        return new Pool({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT, 10) || 5412,
          user: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || 'task_manager',
        });
      },
    },
    DatabaseService,
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
