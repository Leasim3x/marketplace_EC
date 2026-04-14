import { IsOptional, IsString, Length, Matches } from "class-validator";

export class ActualizarClienteDto {

  @IsOptional()
  @IsString()
  @Length(5, 150)
  direccion?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'El telefono debe tener 10 digitos numericos'
  })
  telefono?: string;

}