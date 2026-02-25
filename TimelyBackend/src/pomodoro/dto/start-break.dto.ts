import {IsInt, IsOptional, IsDateString, Min } from 'class-validator';

export class StartBreakDto {
    @IsInt()
    @Min(1)
    sessionId : number;

    @IsOptional()
    @IsDateString()
    startTime? : string;
}