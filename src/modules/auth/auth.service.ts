import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuariosService: UsuariosService
    ) { }

    async login(email: string, password: string) {

        const usuario = await this.usuariosService.buscarPorEMail(email);

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        return {
            mensaje: 'Login correcto',
            usuario: {
                id: usuario.id,
                email: usuario.email
            }
        };
    }
}
