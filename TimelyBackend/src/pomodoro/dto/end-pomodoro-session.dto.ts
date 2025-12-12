import { IsInt, IsOptional, IsDateString, IsPositive } from 'class-validator';

export class EndPomodoroSessionDto {
    @IsInt()
    @IsPositive()
    sessionId : number;

    @IsOptional()
    @IsDateString()
    focusEnd? : string;
}