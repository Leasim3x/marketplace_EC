import { IsEnum } from "class-validator";
import { EstadoOrden } from "../enums/orden-status.enum";

export class ActualizarEstadoOrdenDto {

    @IsEnum(EstadoOrden)
    estado: EstadoOrden;

}