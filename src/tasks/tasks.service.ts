import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateTaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/task.dto';
import { Pool } from 'pg';
import { messages } from '../common/messages';
import { Request } from 'express';
import { DatabaseService } from '../database/database.service';

const sqlParams = {
  db_name: 'tasks',
};

// special sql query for all info task's
const expandTaskInfoQuery =
  'SELECT \n' +
  '      tasks.title, \n' +
  '      tasks.description, \n' +
  '      tasks.start_date, \n' +
  '      tasks.end_date \n' +
  '    FROM \n' +
  '      tasks\n' +
  '    LEFT JOIN \n' +
  '      taskdetails \n' +
  '    ON \n' +
  '      tasks.id = taskdetails.task_id\n';
// ------------- end region ---------------

@Injectable({ scope: Scope.REQUEST })
export class TasksService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @Inject('DATABASE_POOL') private readonly pool: Pool,
    private readonly databaseService: DatabaseService,
  ) {}

  async validateTask(
    id: string | null,
    updateTaskDto?: UpdateTaskDto,
  ): Promise<any> {
    const task = id
      ? await this.findById(id)
      : await this.findOneByTitle(updateTaskDto.title);

    if (id && !task) {
      throw new NotFoundException(messages.TASK_NOT_FOUND);
    }

    return task;
  }

  async findAll() {
    const result = await this.pool.query(
      `${expandTaskInfoQuery} WHERE tasks.user_id = $1`,
      [this.request['user'].sub],
    );
    return result.rows;
  }

  async findOneByTitle(title: string): Promise<any> {
    const result = await this.pool.query(
      `${expandTaskInfoQuery} WHERE tasks.title = $1 AND tasks.user_id = $2`,
      [title, this.request['user'].sub],
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<any> {
    const result = await this.databaseService.findAllByFieldName({
      ...sqlParams,
      field_names: ['id'],
      field_values: [id],
    });

    return result;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<CreateTaskDto> {
    try {
      const result = await this.databaseService.insert({
        ...sqlParams,
        foreign_key: 'user_id',
        foreign_value: this.request['user'].sub,
        field_names: Object.keys(createTaskDto),
        field_values: Object.values(createTaskDto),
      });

      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(messages.TASK_EXIST);
      }
      throw new InternalServerErrorException(messages.DATABASE_ERROR);
    }
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<any> {
    await this.validateTask(id, updateTaskDto);

    const result = await this.databaseService.update(id, {
      ...sqlParams,
      foreign_key: 'user_id',
      foreign_value: this.request['user'].sub,
      field_names: Object.keys(updateTaskDto),
      field_values: Object.values(updateTaskDto),
    });

    return result;
  }

  async removeTask(id: string): Promise<any> {
    await this.validateTask(id);

    const result = await this.databaseService.delete({
      ...sqlParams,
      field_names: ['id'],
      field_values: [id],
    });

    return result;
  }
}
