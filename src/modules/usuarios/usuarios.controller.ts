import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto';

@Controller('usuarios')
export class UsuariosController {

    constructor(private readonly usuariosService: UsuariosService) {}

    @Post()
    registrarUsuario(@Body() registrarUsuarioDto: RegistrarUsuarioDto){
        return this.usuariosService.registrarUsuario(registrarUsuarioDto);
    }

    @Get(':id')
    obtenerPerfil(@Param('id') id: number) {
        return this.usuariosService.obtenerPerfil(id);
    }

    @Patch(':id')
    actualizarPerfil(@Param('id') id: number, @Body() actualizarPerfilDto:ActualizarPerfilDto){
        return this.usuariosService.actualizarPerfil(id, actualizarPerfilDto);
    }

    @Patch('password/:id')
    cambiarPassword(@Param('id') id: number, @Body() cambiarPasswordDto: CambiarPasswordDto){
        return this.usuariosService.cambiarPassword(id, cambiarPasswordDto);
    }

    @Delete('desactivar/:id')
    desactivarUsuario(@Param('id') id: number){
        return this.usuariosService.desactivarUsuario(id);
    }

    @Patch('activar/:id')
    activarUsuario(@Param('id') id: number){
        return this.usuariosService.activarUsuario(id);


    }
}
