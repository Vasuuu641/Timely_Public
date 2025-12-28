import {IsEmail, IsNotEmpty, IsString, MinLength, IsOptional} from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username?: string;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    fullName?: string;
    
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}