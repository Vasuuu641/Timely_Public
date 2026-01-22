import { IsString, IsOptional, IsDateString, IsEnum } from "class-validator";

export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateTodoDto {
    @IsString()
    title : string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsOptional()
    @IsEnum(TodoPriority)
    priority?: TodoPriority;

}


