import { IsString, IsOptional, IsArray, Length, ArrayNotEmpty } from "class-validator";

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
    @ArrayNotEmpty()
    @IsString({ each: true })
    tags?: string[];
    
    @IsOptional()
    @IsString()
    @Length(1, 255)
    category: string; 
}