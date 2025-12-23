import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';
import {
  IsOptional,
  IsString,
  IsArray,
  ArrayMinSize,
  IsInt,
  Min,
} from 'class-validator';

export class UpdateQuizDto extends PartialType(CreateQuizDto) 
{
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  options?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  correctAnswer?: string;

  @IsOptional()
  @IsString()
  topic?: string;
}
