import { IsString, IsOptional, IsBoolean, IsInt } from "class-validator";

export class CreateTodoDto {
    @IsString()

    title : string;

    @IsOptional()
    @IsString()
    
    description?: string;

}

export class UpdateToDoDto {
    @IsOptional()
    @IsString()
    title? : string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;

}

