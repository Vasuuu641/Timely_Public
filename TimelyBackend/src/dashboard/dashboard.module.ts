import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../prisma/prisma.service';
import { GoalProgressHelper } from './helpers/completeGoalProgess';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService, GoalProgressHelper],
})
export class DashboardModule {}
