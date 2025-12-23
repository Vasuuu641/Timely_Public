import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class CreateQuizDto {
    @IsString()
    topic: string;

    @IsString()
    question: string;

    @IsString()
    correctAnswer: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({each: true})
    options: string[];
}
