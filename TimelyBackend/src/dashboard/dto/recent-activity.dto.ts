import { ActivityType } from '../enums/activity-type.enum';

export class RecentActivityDto {
  id?: number | string;
  type: ActivityType;
  title: string;
  createdAt: Date;
}