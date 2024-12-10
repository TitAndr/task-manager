import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ConflictException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/task.dto';
import { messages } from '../common/messages';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':title')
  findOne(@Param('title') title: string) {
    return this.tasksService.findOneByTitle(title);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.validateTask(null, createTaskDto);

    if (task) {
      throw new ConflictException(messages.TASK_EXIST);
    }

    await this.tasksService.createTask(createTaskDto);
    return { message: messages.TASK_CREATED };
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tasksService.removeTask(id);
  }
}
