import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { Repository } from 'typeorm';
import { Proveedor } from '../proveedores/entities/proveedor.entity';

import { CrearEmpresaDto } from './dto/crear-empresa.dto';
import { NotFoundError } from 'rxjs';
import { ActualizarEmpresaDto } from './dto/actualizar-empresa.dto';

@Injectable()
export class EmpresasService {

    constructor(

        @InjectRepository(Empresa)
        private empresaRepository: Repository<Empresa>,

        @InjectRepository(Proveedor)
        private proveedorRepository: Repository<Proveedor>,

    ) { }

    async crearEmpresa(data: CrearEmpresaDto) {

        const proveedor = await this.proveedorRepository.findOne({
            where: { id: data.id_proveedor }
        });

        if (!proveedor) {
            throw new NotFoundException('Proveedor no encontrado');
        }

        const empresa = this.empresaRepository.create({
            ...data,
            proveedor
        });

        return this.empresaRepository.save(empresa);

    }

    async listarEmpresas() {

        return this.empresaRepository.find({

            relations: ['proveedor']
        });

    }

    async obtenerEmpresa(id: number) {

        const empresa = await this.empresaRepository.findOne({

            where: { id },
            relations: ['proveedor']
        });

        if (!empresa) {

            throw new NotFoundException('Empresa no encontrada');

        }

        return empresa;

    }

    async actualizarEmpresa(id: number, data: ActualizarEmpresaDto): Promise<Empresa> {

        const empresa = await this.obtenerEmpresa(id);

        Object.assign(empresa, data);

        return this.empresaRepository.save(empresa);

    }

    async eliminarEmpresa(id: number) {

        const empresa = await this.obtenerEmpresa(id);

        return this.empresaRepository.remove(empresa);
    }
}
