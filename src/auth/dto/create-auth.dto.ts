import { IsEmail, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateAuthDto {

    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(8)
    mobile?: number;

    @IsOptional()
    @IsEmail()
    email?: string;

}
