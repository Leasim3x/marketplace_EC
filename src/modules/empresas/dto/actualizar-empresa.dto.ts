import { CrearEmpresaDto } from "./crear-empresa.dto";

import { PartialType } from '@nestjs/swagger';

export class ActualizarEmpresaDto extends PartialType(CrearEmpresaDto){

}