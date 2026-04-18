import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Proveedor } from './entities/proveedor.entity';
import { CrearProveedorDto } from './dto/crear-proveedor.dto';
import { ActualizarPerfilDto } from '../usuarios/dto/actualizar-perfil.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class ProveedoresService {

    constructor(
        @InjectRepository(Proveedor)
        private proveedorRepository: Repository<Proveedor>,

        // Acceso a la tabla de usuarios
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,

    ) { }

    async crearProveedor(data: CrearProveedorDto): Promise<Proveedor> {

        const { idUsuario, ...datosRestantes } = data;

        // 1. Validamos que el usuario exista
        const usuario = await this.usuarioRepository.findOneBy({ id: idUsuario });

        if(!usuario){
            throw new NotFoundException('El usuario no existe');
        }

        // 2. Validamos que el usuario no tenga ya un proveedor (OneToOne)
        const existe = await this.proveedorRepository.findOne({
            where: { usuario: { id: idUsuario } }
        });

        if(existe){
            throw new BadRequestException('Este usuario ya tiene perfil de proveedor')
        }

        // 3. Creamos y guardamos
        const proveedor = this.proveedorRepository.create({
            ...datosRestantes,
            usuario // Vinculamos el objeto usuario completo
        });

        return await this.proveedorRepository.save(proveedor);

    }

    async obtenerProveedor(id: number): Promise<Proveedor> {

        const proveedor = await this.proveedorRepository.findOne({
            where: { id }
        });

        if (!proveedor) {
            throw new Error('Proveedor no encontrado');
        }

        return proveedor;

    }

    async listarProveedores(): Promise<Proveedor[]> {

        const proveedores = await this.proveedorRepository.find();

        if (!proveedores) {
            throw new Error('No se encontraron proveedores');
        }

        return proveedores;

    }

    async actualizarProveedor(id: number, data: ActualizarPerfilDto): Promise<Proveedor> {

        const proveedor = await this.obtenerProveedor(id);

        Object.assign(proveedor, data);

        return await this.proveedorRepository.save(proveedor);

    }

    async desactivarProveedor(id: number): Promise<Proveedor> {

        const proveedor = await this.obtenerProveedor(id);

        proveedor.activo = false;

        return await this.proveedorRepository.save(proveedor);

    }

    async activarProveedor(id: number): Promise<Proveedor> {

        const proveedor = await this.obtenerProveedor(id);

        proveedor.activo = true;

        return await this.proveedorRepository.save(proveedor);

    }
}
