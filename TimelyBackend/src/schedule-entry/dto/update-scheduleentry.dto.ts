import { IsString, IsBoolean, IsDateString, IsOptional, Length } from 'class-validator';

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
}
