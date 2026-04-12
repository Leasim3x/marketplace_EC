import { IsString, IsEmail, MinLength, IsDate, IsOptional } from 'class-validator';
import { IsAdult } from './is-adult.decorator';
import { Type } from 'class-transformer';

export class RegistrarUsuarioDto {

    @IsString()
    nombre: string;

    @IsString()
    apellidoPaterno: string;

    @IsOptional()
    @IsString()
    apellidoMaterno?: string;

    @IsDate()
    @Type(() => Date)
    @IsAdult()
    fechaNacimiento?: Date;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}