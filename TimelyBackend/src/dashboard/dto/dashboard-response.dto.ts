import { DashboardStatsDto } from './dashboard-stats.dto';
import { UpcomingTaskDto } from './upcoming-tasks.dto';
import { RecentActivityDto } from './recent-activity.dto';

export class DashboardResponseDto {
  stats: DashboardStatsDto;
  upcomingTasks: UpcomingTaskDto[];
  recentActivity: RecentActivityDto[];
}