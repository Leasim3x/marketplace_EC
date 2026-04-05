import { IsOptional, IsString } from 'class-validator';

export class ActualizarPerfilDto {

    @IsOptional()
    @IsString()
    nombre?: string;
    
}