import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum } from "class-validator";

export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class UpdateToDoDto {
    @IsOptional()
    @IsString()
    title? : string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;

    @IsOptional()
    @IsDateString()
    dueDate?: string;
    
    @IsOptional()
    @IsEnum(TodoPriority)
    priority?: TodoPriority;
    
}
