import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from './entities/usuario.entity';
import { RegistrarUsuarioDto } from './dto/registrar-usuario.dto';
import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    // Aplicación anterior de un constructor
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) { }

    async registrarUsuario(data: RegistrarUsuarioDto) {

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const usuario = this.usuarioRepository.create({
            ...data,
            password: hashedPassword
        });

        return this.usuarioRepository.save(usuario);
    }

    async obtenerPerfil(id: number) {
        const usuario = await this.usuarioRepository.findOne({
            where: { id }
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }

    async buscarPorEMail(email: string) {
        
        const usuario = await this.usuarioRepository.findOne({
            where: { email }
        });

        return usuario;
    }

    async actualizarPerfil(id: number, data: ActualizarPerfilDto) {
        await this.usuarioRepository.update(id, data);

        return this.obtenerPerfil(id);
    }

    async cambiarPassword(id: number, data: CambiarPasswordDto) {
        const usuario = await this.obtenerPerfil(id);

        // Falta validar que el password actual coincida con el almacenado en la base de datos
        usuario.password = data.nuevoPassword;

        return this.usuarioRepository.save(usuario);
    }

    async verificarEmail(email: string){
        return this.usuarioRepository.findOne({
            where: { email }
        });
    }

    async desactivarUsuario(id: number){
        const usuario = await this.obtenerPerfil(id);
        
        usuario.activo = false;

        return this.usuarioRepository.save(usuario);
    }

    async activarUsuario(id: number){
        const usuario = await this.obtenerPerfil(id);

        usuario.activo = true;

        return this.usuarioRepository.save(usuario);

    }

}
