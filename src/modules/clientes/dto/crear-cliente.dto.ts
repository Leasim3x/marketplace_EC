import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Length, Matches } from "class-validator";

export class RegistrarClienteDto {

    @Type(() => Number)
    @IsNumber()
    id_usuario: number;

    @IsOptional()
    @IsString()
    @Length(5, 150)
    direccion?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[0-9]{10}$/, {
        message: 'El telefono debe tener 10 dígitos númericos'
    })
    telefono?: string;

}