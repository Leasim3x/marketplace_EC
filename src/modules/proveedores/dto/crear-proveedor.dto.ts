import { IsOptional, IsString } from "class-validator";

export class CrearProveedorDto {

    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    direccion?: string;

    @IsString()
    telefono: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

}