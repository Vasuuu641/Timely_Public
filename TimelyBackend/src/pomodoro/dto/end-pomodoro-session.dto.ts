import { IsInt, IsOptional, IsDateString, Min } from 'class-validator';

export class EndPomodoroSessionDto {
    @IsInt()
    @Min(1)
    sessionId : number;

    @IsOptional()
    @IsDateString()
    focusEnd? : string;
}