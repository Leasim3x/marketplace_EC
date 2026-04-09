import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CrearProductoDto {

    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsNumber()
    @IsPositive()
    precio: number;

    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsString()
    imagenUrl?:string

    @IsNumber()
    id_empresa: number;

}