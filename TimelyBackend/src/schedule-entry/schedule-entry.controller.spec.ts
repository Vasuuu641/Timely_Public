import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleEntryController } from './schedule-entry.controller';
import { ScheduleEntryService } from './schedule-entry.service';

describe('ScheduleEntryController', () => {
  let controller: ScheduleEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleEntryController],
      providers: [ScheduleEntryService],
    }).compile();

    controller = module.get<ScheduleEntryController>(ScheduleEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
