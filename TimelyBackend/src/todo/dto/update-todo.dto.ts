import { IsString, IsOptional, IsBoolean } from "class-validator";

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
