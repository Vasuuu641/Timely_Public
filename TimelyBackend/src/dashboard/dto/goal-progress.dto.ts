import { GoalType } from '../../studyGoal/enums/goal-type.enum';

export class GoalProgressDto {
  id: string;
  type: GoalType;
  target: number;
  current: number;
  progressPercent: number;
  startDate: Date;
  endDate: Date;
}
