// src/studyGoal/dto/create-goal.dto.ts
import { IsString, IsOptional, IsInt, Min, IsEnum, Length } from 'class-validator';
import { GoalType } from '../enums/goal-type.enum';

export class UpdateGoalDto {
  @IsOptional()
  @IsEnum(GoalType)
  type?: GoalType; 

  @IsOptional()
  @IsInt()
  @Min(1)
  target?: number; 

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string; 

  @IsOptional()
  @IsString()
  startDate?: string; 

  @IsOptional()
  @IsString()
  endDate?: string; 
}
