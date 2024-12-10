import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskDetailDto } from './dto/task.detail.dto';
import { DatabaseService } from '../database/database.service';
import { messages } from '../common/messages';

const sqlParams = {
  db_name: 'taskDetails',
};

@Injectable()
export class TaskDetailsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateTaskDetail(
    taskId: string | null,
    isNew?: boolean,
  ): Promise<any> {
    const taskDetail = await this.findByTaskId(taskId);

    if (!isNew && !taskDetail) {
      throw new NotFoundException(messages.TASK_DETAIL_NOT_FOUND);
    }

    return taskDetail;
  }

  async findByTaskId(taskId: string): Promise<any> {
    const result = await this.databaseService.findAllByFieldName({
      ...sqlParams,
      field_names: ['task_id'],
      field_values: [taskId],
    });
    return result;
  }

  async createTaskDetail(
    taskId: string,
    taskDetailDto: TaskDetailDto,
  ): Promise<TaskDetailDto> {
    try {
      const result = await this.databaseService.insert({
        ...sqlParams,
        foreign_key: 'task_id',
        foreign_value: taskId,
        field_names: Object.keys(taskDetailDto),
        field_values: Object.values(taskDetailDto),
      });

      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(messages.TASK_DETAIL_EXIST);
      }
      throw new InternalServerErrorException(messages.DATABASE_ERROR);
    }
  }

  async updateTaskDetail(
    task_id: string,
    taskDetailDto: TaskDetailDto,
  ): Promise<any> {
    await this.validateTaskDetail(task_id);

    const result = await this.databaseService.update(null, {
      ...sqlParams,
      foreign_key: 'task_id',
      foreign_value: task_id,
      field_names: Object.keys(taskDetailDto),
      field_values: Object.values(taskDetailDto),
    });

    return result;
  }

  async removeTaskDetail(taskId: string): Promise<any> {
    await this.validateTaskDetail(taskId);

    const result = await this.databaseService.delete({
      ...sqlParams,
      field_names: ['task_id'],
      field_values: [taskId],
    });

    return result;
  }
}
