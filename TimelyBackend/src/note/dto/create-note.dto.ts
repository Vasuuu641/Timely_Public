import { IsString, IsOptional, Length, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateNoteDto 
{
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @Length(1, 5000)
  content: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  date?: string;
}