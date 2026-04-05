import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegistrarUsuarioDto {

    @IsString()
    nombre: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}