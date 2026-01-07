import { DashboardStatsDto } from './dashboard-stats.dto';
import { UpcomingTaskDto } from './upcoming-tasks.dto';
import { RecentActivityDto } from './recent-activity.dto';
import { GoalProgressDto } from './goal-progress.dto';
import { FeatureName } from 'src/feature-usage/featureUsage.service';

export class DashboardResponseDto {
  stats: DashboardStatsDto;
  upcomingTasks: UpcomingTaskDto[];
  recentActivity: RecentActivityDto[];
  goals: GoalProgressDto[];
  quickActions: FeatureName[];
}