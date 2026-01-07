import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../prisma/prisma.service';
import { GoalProgressHelper } from './helpers/completeGoalProgess';
import { FeatureUsageModule } from 'src/feature-usage/featureUsage.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, FeatureUsageModule],
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService, GoalProgressHelper],
})
export class DashboardModule {}
