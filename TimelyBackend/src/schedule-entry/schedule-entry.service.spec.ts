import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleEntryService } from './schedule-entry.service';

describe('ScheduleEntryService', () => {
  let service: ScheduleEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleEntryService],
    }).compile();

    service = module.get<ScheduleEntryService>(ScheduleEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
