import { IsInt, IsPositive } from "class-validator";

export class AgregarProductoDto {

    @IsInt()
    idProducto: number;

    @IsInt()
    @IsPositive()
    cantidad: number;

}