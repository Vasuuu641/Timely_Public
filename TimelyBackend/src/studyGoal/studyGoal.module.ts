// studyGoal.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudyGoalService } from './studyGoal.service';
import { StudyGoalController } from './studyGoal.controller';

@Module({
  controllers: [StudyGoalController],
  providers: [StudyGoalService, PrismaService],
})
export class StudyGoalModule {}
