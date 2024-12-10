import { Module } from '@nestjs/common';
import { TaskDetailsService } from './task-details.service';
import { TaskDetailsController } from './task-details.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [TaskDetailsController],
  providers: [TaskDetailsService, DatabaseService],
})
export class TaskDetailsModule {}
