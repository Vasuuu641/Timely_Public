import { IsEnum, IsNotEmpty } from 'class-validator';
import { PomodoroLevel } from 'generated/prisma';

export class CreatePomodoroSessionDto {
    
    @IsEnum(PomodoroLevel)
    @IsNotEmpty()
    level : PomodoroLevel;
    

}