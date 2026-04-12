import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { IsAdult } from './is-adult.decorator';

export class ActualizarPerfilDto {

    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    apellidoPaterno?: string;

    @IsOptional()
    @IsString()
    apellidoMaterno?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @IsAdult()
    fechaNacimiento?: Date;

}