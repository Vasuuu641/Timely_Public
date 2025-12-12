import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, Min, Max, Length } from "class-validator";

export class CreateDailyReviewDto {

    @IsOptional()
    @IsDateString()

    date? : string;

    @IsString()
    @Length(1, 500)

    reflection : string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)

    rating? : number;



}

export class UpdateDailyReviewDto {


    @IsOptional()
    @IsString()
    @Length(1, 500)

    reflection? : string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)

    rating? : number;

}

