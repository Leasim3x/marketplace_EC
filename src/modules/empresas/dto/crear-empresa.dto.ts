import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CrearEmpresaDto {

    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    direccion?: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

    @IsNumber()
    id_proveedor: number;

}