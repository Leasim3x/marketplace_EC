import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarEmpresaDto } from '../empresas/dto/actualizar-empresa.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { ActualizarStockDto } from './dto/actualizar-stock.dto';


@Injectable()
export class ProductosService {

    constructor(

        @InjectRepository(Producto)
        private productoRepository: Repository<Producto>,

        @InjectRepository(Empresa)
        private empresaRepository: Repository<Empresa>,

    ) { }

    async crearProducto(data: CrearProductoDto) {

        const empresa = await this.empresaRepository.findOne({
            where: { id: data.id_empresa }
        });

        if (!empresa) {
            throw new NotFoundException('Empresa no encontrada');
        }

        const producto = this.productoRepository.create({
            ...data,
            empresa,
            activo: (data?.stock ?? 0) > 0,
        });

        return this.productoRepository.save(producto);

    }

    async listarTodosProductos() {

        return this.productoRepository.find({
            relations: ['empresa']
        });

    }

    async listarProductos() {

        return this.productoRepository.find({

            where: { activo: true },
            relations: ['empresa']
        });

    }

    async obtenerProducto(id: number) {

        const producto = await this.productoRepository.findOne({
            where: { id },
            relations: ['empresa']
        });

        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }

        return producto;
    }

    async actualizarProducto(id: number, data: ActualizarProductoDto) {

        const producto = await this.obtenerProducto(id);

        // quitar stock del DTO
        const { stock, ...resto } = data;

        Object.assign(producto, resto);

        return this.productoRepository.save(producto);
    }

    async actualizarStock(id: number, data: ActualizarStockDto) {

        const producto = await this.obtenerProducto(id);

        producto.stock = data.stock;

        // activar o desactivar automáticamente
        producto.activo = data.stock > 0;

        return this.productoRepository.save(producto);
    }

    async eliminarProducto(id: number) {

        const producto = await this.obtenerProducto(id);

        producto.activo = false;

        return this.productoRepository.save(producto);

    }
}
