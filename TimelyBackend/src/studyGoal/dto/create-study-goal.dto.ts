// src/studyGoal/dto/create-goal.dto.ts
import { IsString, IsOptional, IsInt, Min, Max, IsEnum, Length } from 'class-validator';
import { GoalType } from '../enums/goal-type.enum';

export class CreateGoalDto {
  @IsEnum(GoalType)
  type: GoalType; 

  @IsInt()
  @Min(1)
  target: number; 

  @IsString()
  @Length(0, 500)
  notes: string; 

  
  @IsString()
  startDate: string; 

  
  @IsString()
  endDate: string; 
}
