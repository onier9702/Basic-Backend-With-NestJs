
import { IsString, MinLength } from "class-validator";

export class LoginAuthDto {

    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

}