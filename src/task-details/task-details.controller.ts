import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ParseUUIDPipe,
  ConflictException,
  Query,
} from '@nestjs/common';
import { TaskDetailsService } from './task-details.service';
import { TaskDetailDto } from './dto/task.detail.dto';
import { messages } from '../common/messages';

@Controller('task-details')
export class TaskDetailsController {
  constructor(private readonly taskDetailsService: TaskDetailsService) {}

  @Get()
  findOne(@Query('taskId', new ParseUUIDPipe()) taskId: string) {
    return this.taskDetailsService.findByTaskId(taskId);
  }

  @Post()
  async create(
    @Query('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() taskDetailDto: TaskDetailDto,
  ) {
    const task = await this.taskDetailsService.validateTaskDetail(taskId, true);

    if (task) {
      throw new ConflictException(messages.TASK_DETAIL_EXIST);
    }

    await this.taskDetailsService.createTaskDetail(taskId, taskDetailDto);
    return { message: messages.TASK_DETAIL_CREATED };
  }

  @Patch()
  update(
    @Query('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() taskDetailDto: TaskDetailDto,
  ) {
    return this.taskDetailsService.updateTaskDetail(taskId, taskDetailDto);
  }

  @Delete()
  remove(@Query('taskId', new ParseUUIDPipe()) taskId: string) {
    return this.taskDetailsService.removeTaskDetail(taskId);
  }
}
