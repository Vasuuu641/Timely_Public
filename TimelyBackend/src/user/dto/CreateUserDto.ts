import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    fullname: string;

    @IsString()
    @MinLength(6)
    password: string;
}