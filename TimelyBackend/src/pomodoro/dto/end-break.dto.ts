import { IsInt, IsOptional, IsDateString, Min } from 'class-validator';

export class EndBreakDto {
    @IsInt()
    @Min(1)
    breakId : number;

    @IsOptional()
    @IsDateString()
    endTime? : string;

}