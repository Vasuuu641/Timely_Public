import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';
import {
  IsOptional,
  IsString,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class UpdateQuizDto extends PartialType(CreateQuizDto) 
{
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  options?: string[];

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsString()
  topic?: string;
}
