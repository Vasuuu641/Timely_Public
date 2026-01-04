import { GoalType } from '../enums/goal-type.enum';

export class StudyGoalResponseDto {
  id: string;
  type: GoalType;
  target: number;
  progress: number; 
  notes: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
