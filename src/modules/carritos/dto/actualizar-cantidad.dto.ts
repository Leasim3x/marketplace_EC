import { IsInt, IsPositive } from "class-validator";

export class ActualizarCantidadDto {
    
    @IsInt()
    @IsPositive()
    cantidad: number;
    
}