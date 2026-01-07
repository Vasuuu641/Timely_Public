import { Module } from '@nestjs/common';
import { ScheduleEntryService } from './schedule-entry.service';
import { ScheduleEntryController } from './schedule-entry.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FeatureUsageModule } from 'src/feature-usage/featureUsage.module';

@Module({
  imports: [PrismaModule, FeatureUsageModule],
  controllers: [ScheduleEntryController],
  providers: [ScheduleEntryService],
})
export class ScheduleEntryModule {}
