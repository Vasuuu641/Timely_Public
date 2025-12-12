import {IsInt, IsOptional, IsPositive, IsDateString } from 'class-validator';

export class StartBreakDto {
    @IsInt()
    @IsPositive()
    sessionId : number;

    @IsOptional()
    @IsDateString()
    startTime? : string;
}