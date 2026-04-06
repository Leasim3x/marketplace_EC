import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Proveedor } from './entities/proveedor.entity';
import { CrearProveedorDto } from './dto/crear-proveedor.dto';
import { ActualizarPerfilDto } from '../usuarios/dto/actualizar-perfil.dto';

@Injectable()
export class ProveedoresService {

    constructor(
        @InjectRepository(Proveedor)
        private proveedorRepository: Repository<Proveedor>,
    ) { }

    async crearProveedor(data: CrearProveedorDto): Promise<Proveedor> {
        const proveedor = this.proveedorRepository.create(data);

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
