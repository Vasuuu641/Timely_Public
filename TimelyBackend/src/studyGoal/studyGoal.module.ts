// studyGoal.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudyGoalService } from './studyGoal.service';
import { StudyGoalController } from './studyGoal.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FeatureUsageModule } from 'src/feature-usage/featureUsage.module';

@Module({
  imports: [PrismaModule, FeatureUsageModule],
  controllers: [StudyGoalController],
  providers: [StudyGoalService, PrismaService],
})
export class StudyGoalModule {}
