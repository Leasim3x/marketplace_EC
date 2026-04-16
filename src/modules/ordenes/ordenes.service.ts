import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Orden } from './entities/orden.entity';

import { OrdenProveedor } from '../orden_proveedores/entities/orden-proveedor.entity';
import { OrdenItem } from '../orden_items/entities/orden-item.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { Producto } from '../productos/entities/producto.entity';

import { CrearOrdenDto } from './dto/crear-orden.dto';
import { EstadoOrden } from './enums/orden-status.enum';
import { EstadoOrdenProveedor } from '../orden_proveedores/enums/orden-proveedor-status.enum';

@Injectable()
export class OrdenesService {

    constructor(

        @InjectRepository(Orden)
        private ordenRepository: Repository<Orden>,

        @InjectRepository(OrdenProveedor)
        private ordenProveedorRepository: Repository<OrdenProveedor>,

        @InjectRepository(OrdenItem)
        private ordenItemRepository: Repository<OrdenItem>,

        @InjectRepository(Producto)
        private productoRepository: Repository<Producto>,

        @InjectRepository(Cliente)
        private clienteRepository: Repository<Cliente>,

        @InjectRepository(Proveedor)
        private proveedorRepository: Repository<Proveedor>,

    ) { }

    async crearOrden(data: CrearOrdenDto) {

        const cliente = await this.clienteRepository.findOne({
            where: { id: data.id_cliente }
        });

        if (!cliente) {
            throw new NotFoundException('Cliente no encontrado');
        }

        let totalOrden = 0;

        const mapaProveedores = new Map<number, any[]>();

        // 🔥 VALIDAR Y AGRUPAR PRODUCTOS PRIMERO
        for (const item of data.productos) {

            const producto = await this.productoRepository.findOne({
                where: { id: item.id_producto },
                relations: ['empresa', 'empresa.proveedor']
            });

            if (!producto) {
                throw new NotFoundException(`Producto ${item.id_producto} no existe`);
            }

            if (!producto.activo) {
                throw new BadRequestException(`Producto ${producto.nombre} inactivo`);
            }

            if (producto.stock < item.cantidad) {
                throw new BadRequestException(
                    `Stock insuficiente para el producto: ${producto.nombre}`
                );
            }

            const proveedorId = producto.empresa.proveedor.id;

            if (!mapaProveedores.has(proveedorId)) {
                mapaProveedores.set(proveedorId, []);
            }

            mapaProveedores.get(proveedorId)?.push({
                producto,
                cantidad: item.cantidad
            });
        }

        // 🔥 AHORA SÍ crear la orden
        const orden = this.ordenRepository.create({
            cliente,
            total: 0
        });

        await this.ordenRepository.save(orden);

        // 🔥 PROCESAR ORDEN
        for (const [proveedorId, items] of mapaProveedores) {

            const proveedor = items[0].producto.empresa.proveedor;

            let subtotalProveedor = 0;

            const ordenProveedor = this.ordenProveedorRepository.create({
                orden,
                proveedor,
                subtotal: 0
            });

            await this.ordenProveedorRepository.save(ordenProveedor);

            for (const item of items) {

                const subtotal = Number(item.producto.precio) * item.cantidad;

                const ordenItem = this.ordenItemRepository.create({
                    ordenProveedor,
                    producto: item.producto,
                    cantidad: item.cantidad,
                    precioUnitario: item.producto.precio,
                    subtotal
                });

                subtotalProveedor += subtotal;
                totalOrden += subtotal;

                await this.ordenItemRepository.save(ordenItem);

                item.producto.stock -= item.cantidad;
                item.producto.activo = item.producto.stock > 0;

                await this.productoRepository.save(item.producto);
            }

            ordenProveedor.subtotal = subtotalProveedor;
            await this.ordenProveedorRepository.save(ordenProveedor);
        }

        orden.total = totalOrden;

        return this.ordenRepository.save(orden);
    }

    async obtenerOrdenes() {

        return this.ordenRepository.find({
            relations: [
                'cliente',
                'ordenesProveedor',
                'ordenesProveedor.proveedor'
            ]
        });

    }

    async obtenerOrden(id: number) {

        const orden = await this.ordenRepository.findOne({
            where: { id },
            relations: [
                'cliente',
                'ordenesProveedor',
                'ordenesProveedor.proveedor',
                'ordenesProveedor.items',
                'ordenesProveedor.items.producto'
            ]
        });

        if (!orden) {
            throw new NotFoundException('Orden no encontrada');
        }

        return orden;

    }

    async actualizarEstado(id: number, estado: EstadoOrden) {

        const orden = await this.ordenRepository.findOne({
            where: { id }
        });

        if (!orden) {
            throw new NotFoundException('Orden no encontrada');
        }

        orden.estado = estado;

        return this.ordenRepository.save(orden);

    }

    async cancelarOrden(id: number) {

        const orden = await this.ordenRepository.findOne({
            where: { id },
            relations: [
                'ordenesProveedor',
                'ordenesProveedor.items',
                'ordenesProveedor.items.producto'
            ]
        });

        if (!orden) {
            throw new NotFoundException('Orden no encontrada');
        }

        if (
            orden.estado === EstadoOrden.CANCELADO ||
            orden.estado === EstadoOrden.ENVIADO
        ) {
            throw new BadRequestException('No se puede cancelar esta orden');
        }

        // Devolver stock
        for (const op of orden.ordenesProveedor) {
            for (const item of op.items) {
                const producto = item.producto;

                producto.stock += item.cantidad;

                // Reactivar si vuelve a tener stock
                if (producto.stock > 0) {
                    producto.activo = true;
                }

                await this.productoRepository.save(producto);

            }

        }

        // Cambiar estato
        orden.estado = EstadoOrden.CANCELADO;

        return this.ordenRepository.save(orden);

    }

    async cancelarOrdenProveedor(id: number) {

        const ordenProveedor = await this.ordenProveedorRepository.findOne({
            where: { id },
            relations: [
                'orden',
                'items',
                'items.producto',
                'orden.ordenesProveedor'
            ]
        });

        if (!ordenProveedor) {
            throw new NotFoundException('OrdendProveedor no encontrada');
        }

        if (ordenProveedor.estado === EstadoOrdenProveedor.CANCELADO) {
            throw new BadRequestException('Ya esta cancelado');
        }

        // Evita cancelar si ya fue enviado
        if (ordenProveedor.estado === EstadoOrdenProveedor.ENVIADO) {
            throw new BadRequestException('No se puede cancelar un envío realizado');
        }

        // Devuelve el stock solo en este proveedor
        for (const item of ordenProveedor.items) {

            const producto = item.producto;

            producto.stock += item.cantidad;

            if (producto.stock > 0) {
                producto.activo = true;
            }

            await this.productoRepository.save(producto);

        }

        // Cambiar el estado del proveedor
        ordenProveedor.estado = EstadoOrdenProveedor.CANCELADO;
        await this.ordenProveedorRepository.save(ordenProveedor);

        // Recalcular estado de la orden
        const ordenActualizada = await this.ordenRepository.findOne({
            where: { id: ordenProveedor.orden.id },
            relations: ['ordenesProveedor']
        });

        if (!ordenActualizada) {
            throw new NotFoundException('Orden no encontrada');
        }

        const proveedores = ordenActualizada.ordenesProveedor;

        const todosCancelados = proveedores.every(
            p => p.estado === EstadoOrdenProveedor.CANCELADO
        );

        const algunoCancelado = proveedores.some(
            p => p.estado === EstadoOrdenProveedor.CANCELADO
        );

        // Actualizar estado de la orden
        if (todosCancelados) {
            ordenActualizada.estado = EstadoOrden.CANCELADO;
        } else if (algunoCancelado) {
            ordenActualizada.estado = EstadoOrden.PARCIAL;
        }

        // Recalcular total
        let nuevoTotal = 0;

        for (const p of proveedores) {
            if (p.estado !== EstadoOrdenProveedor.CANCELADO) {
                nuevoTotal += Number(p.subtotal);
            }
        }

        ordenActualizada.total = nuevoTotal;

        await this.ordenRepository.save(ordenActualizada);

        return {
            mensaje: 'Proveedor cancelado correctamente',
            ordenProveedor
        };

    }
}
