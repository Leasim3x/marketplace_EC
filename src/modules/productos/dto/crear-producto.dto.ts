import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CrearProductoDto {

    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    precio: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsString()
    imagenUrl?:string

    @IsNumber()
    id_empresa: number;

}