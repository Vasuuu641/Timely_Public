import { IsString, IsBoolean, IsDateString, IsOptional, Length, IsIn } from 'class-validator';

export class CreateScheduleEntryDto {
    @IsString()
    @Length(1, 255)
    title: string;

    @IsBoolean()
    isDailyPlan: boolean;

    @IsDateString()
    startTime: string;

    @IsOptional()
    @IsDateString()
    endTime?: string; // optional for future use

    @IsOptional()
    @IsString()
    @Length(0, 500)
    notes?: string; // optional notes field

    @IsOptional()
    @IsBoolean()
    isRecurring?: boolean; // for future recurring schedules

    @IsOptional()
    @IsString()
    @IsIn(['High', 'Medium', 'Low'])
    priority?: string; // default is Medium in schema

    @IsOptional()
    @IsString()
    @IsIn(['ToDo', 'InProgress', 'Done'])
    status?: string; // default is ToDo in schema
}
