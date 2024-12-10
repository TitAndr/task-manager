import { Test, TestingModule } from '@nestjs/testing';
import { TaskDetailsController } from './task-details.controller';
import { TaskDetailsService } from './task-details.service';
import { DatabaseService } from '../database/database.service';

describe('TaskDetailsController', () => {
  let controller: TaskDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskDetailsController],
      providers: [TaskDetailsService, DatabaseService],
    }).compile();

    controller = module.get<TaskDetailsController>(TaskDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
