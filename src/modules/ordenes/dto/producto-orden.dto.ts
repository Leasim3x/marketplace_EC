import { Type } from "class-transformer";
import { IsInt, IsNumber, Min } from "class-validator";

export class ProductoOrdenDto {

    @Type(() => Number)
    @IsNumber()
    id_producto: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    cantidad: number;
    
}