import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
export class JWTPayload {
    id: string;
    email: string;
    username: string;
}

export class signInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}
