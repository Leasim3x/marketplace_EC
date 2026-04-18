import { IsOptional, IsString, Matches } from "class-validator";

export class ActualizarProveedorDto {

    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    direccion?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[0-9]{10}$/, {
        message: 'El telefono debe tener 10 dígitos númericos'
    })
    telefono?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

}