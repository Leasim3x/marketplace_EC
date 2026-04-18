import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { RegistrarClienteDto } from './dto/crear-cliente.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';

@Injectable()
export class ClientesService {

    constructor(

        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,

        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,

    ) { }

    async registrarCliente(data: RegistrarClienteDto) {

        const usuario = await this.usuarioRepository.findOne({
            where: { id: data.idUsuario }
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado')
        }

        const clienteExistente = await this.clienteRepository.findOne({
            where: { usuario: { id: data.idUsuario } }
        });

        if (clienteExistente) {
            throw new BadRequestException('Este usuario ya tiene una cuenta de cliente registrada');
        }

        const cliente = this.clienteRepository.create({
            ...data,
            usuario,
            activo: true,
        });

        return this.clienteRepository.save(cliente);

    }

    async listarClientes() {

        return this.clienteRepository.find({
            where: { activo: true },
            relations: ['usuario']
        });

    }

    async obtenerCliente(id: number): Promise<Cliente> {

        const cliente = await this.clienteRepository.findOne({
            where: { id },
            relations: ['usuario']
        });

        if (!cliente) {
            throw new NotFoundException('Cliente no encontrado');
        }

        return cliente;

    }

    async actualizarCliente(id: number, data: ActualizarClienteDto): Promise<Cliente> {

        const cliente = await this.obtenerCliente(id);

        if (data.direccion !== undefined) {
            cliente.direccion = data.direccion;
        }

        if (data.telefono !== undefined) {
            cliente.telefono = data.telefono;
        }

        return this.clienteRepository.save(cliente);
    }

    async desactivarCliente(id: number): Promise<Cliente> {

        const cliente = await this.obtenerCliente(id);

        if (!cliente.activo) {
            throw new BadRequestException('El cliente ya está desactivado');
        }

        cliente.activo = false;

        return this.clienteRepository.save(cliente);

    }

    async activarCliente(id: number): Promise<Cliente> {

        const cliente = await this.obtenerCliente(id);
        if (cliente.activo) {
            throw new BadRequestException('El cliente ya está activo');
        }

        cliente.activo = true;

        return this.clienteRepository.save(cliente);

    }
}
