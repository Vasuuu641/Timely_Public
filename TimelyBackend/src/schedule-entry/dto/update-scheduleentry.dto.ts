import { IsString, IsBoolean, IsDateString, IsOptional, Length, IsIn } from 'class-validator';

export class UpdateScheduleEntryDto {
    @IsOptional()
    @IsString()
    @Length(1, 255)
    title?: string;

    @IsOptional()
    @IsBoolean()
    isDailyPlan?: boolean;

    @IsOptional()
    @IsDateString()
    startTime?: string;

    @IsOptional()
    @IsDateString()
    endTime?: string;

    @IsOptional()
    @IsString()
    @Length(0, 500)
    notes?: string;

    @IsOptional()
    @IsBoolean()
    isRecurring?: boolean;

    @IsOptional()
    @IsString()
    @IsIn(['High', 'Medium', 'Low'])
    priority?: string; // optional tags field

    @IsOptional()
    @IsString()
    @IsIn(['ToDo', 'InProgress', 'Done'])
    status?: string; // default is ToDo in schema
}
