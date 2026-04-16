import { Type } from "class-transformer";
import { ArrayMinSize, IsNumber, ValidateNested } from "class-validator";

import { ProductoOrdenDto } from "./producto-orden.dto";

export class CrearOrdenDto {

    @Type(() => Number)
    @IsNumber()
    id_cliente: number;

    @ValidateNested({ each: true })
    @Type(() => ProductoOrdenDto)
    @ArrayMinSize(1)
    productos: ProductoOrdenDto[];

}