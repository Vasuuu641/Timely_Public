import { IsString, IsOptional, IsArray, Length } from "class-validator";

export class UpdateNoteDto 
{
    @IsOptional()
    @IsString()
    @Length(1, 255)
    title?: string;

    @IsOptional()
    @IsString()
    @Length(1, 5000)
    content?: string;
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}