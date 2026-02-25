import { IsString, IsBoolean, IsOptional, Length, IsIn, Matches } from 'class-validator';

export class CreateScheduleEntryDto {
    @IsString()
    @Length(1, 255)
    title: string;

    @IsBoolean()
    isDailyPlan: boolean;

    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/, { message: 'startTime must be a valid datetime string' })
    startTime: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/, { message: 'endTime must be a valid datetime string' })
    endTime?: string; // optional for future use

    @IsOptional()
    @IsString()
    @Length(1, 100)
    topic?: string; // optional topic/category field

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
