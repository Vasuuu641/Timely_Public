import { Module } from '@nestjs/common';
import { ScheduleEntryService } from './schedule-entry.service';
import { ScheduleEntryController } from './schedule-entry.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScheduleEntryController],
  providers: [ScheduleEntryService],
})
export class ScheduleEntryModule {}
