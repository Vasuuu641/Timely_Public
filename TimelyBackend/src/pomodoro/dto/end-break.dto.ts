import { IsInt, IsOptional, IsDateString, IsPositive } from 'class-validator';

export class EndBreakDto {
    @IsInt()
    @IsPositive()
    breakId : number;

    @IsOptional()
    @IsDateString()
    endTime? : string;

}