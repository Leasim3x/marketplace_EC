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

    async obtenerPorCliente(idCliente: number) {

        const ordenes = await this.ordenRepository.find({
            where: {
                cliente: { id: idCliente }
            },
            relations: [
                'cliente',
                'ordenesProveedor',
                'ordenesProveedor.proveedor',
                'ordenesProveedor.items',
                'ordenesProveedor.items.producto',
            ],
            order: {
                fecha: 'DESC'
            }
        });

        if (!ordenes || ordenes.length === 0) {
            throw new NotFoundException('No se encontraron órdenes para este cliente');
        }

        return ordenes;

    }

    async obtenerPorProveedor(id: number) {

        const ordenes = await this.ordenRepository.find({
            where: {
                ordenesProveedor: {
                    proveedor: { id: id }
                }
            },
            relations: [
                'cliente',
                'ordenesProveedor',
                'ordenesProveedor.proveedor',
                'ordenesProveedor.items',
                'ordenesProveedor.items.producto',
            ],
            order: { fecha: 'DESC' }
        });

        if (!ordenes || ordenes.length === 0) {
            throw new NotFoundException('No se encontraron órdenes para este proveedor')
        }

        return ordenes;

    }

    async obtenerPorEstado(estado: EstadoOrden) {

        const ordenes = await this.ordenRepository.find({
            where: { estado },
            relations: [
                'cliente',
                'ordenesProveedor',
                'ordenesProveedor.proveedor',
                'ordenesProveedor.items',
                'ordenesProveedor.items.producto'
            ],
            // Lógica condicional: si es pendiete, las más viejas primero
            order: {
                fecha: estado === EstadoOrden.PENDIENTE ? 'ASC' : 'DESC'
            }
        });

        if (ordenes.length === 0) {
            throw new NotFoundException(`No se encontraron órdenes en estado: ${estado}`);
        }

        return ordenes;

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

    private async cancelarOrdenProveedorInterno(
        ordenProveedor: OrdenProveedor
    ) {

        if (ordenProveedor.estado === EstadoOrdenProveedor.CANCELADO) {
            return;
        }

        if (ordenProveedor.estado === EstadoOrdenProveedor.ENVIADO) {
            throw new BadRequestException(
                `Proveedor ${ordenProveedor.id} ya envió el pedido`
            );
        }

        // Devolver stock
        for (const item of ordenProveedor.items) {

            const producto = item.producto;

            producto.stock += item.cantidad;

            if (producto.stock > 0) {
                producto.activo = true;
            }

            await this.productoRepository.save(producto);
        }

        // Cambiar estado
        ordenProveedor.estado = EstadoOrdenProveedor.CANCELADO;

        return ordenProveedor;
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
            orden.estado === EstadoOrden.COMPLETADO
        ) {
            throw new BadRequestException('No se puede cancelar esta orden');
        }

        // Cancelar todos SIN volver a consultar DB
        for (const op of orden.ordenesProveedor) {
            await this.cancelarOrdenProveedorInterno(op);
        }

        // Guardar todos juntos
        await this.ordenProveedorRepository.save(orden.ordenesProveedor);

        // Recalcular UNA sola vez
        await this.recalcularOrden(orden.id);

        return {
            mensaje: 'Orden cancelada completamente'
        };
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
            throw new NotFoundException('OrdenProveedor no encontrada');
        }

        if (
            ordenProveedor.orden.estado === EstadoOrden.CANCELADO ||
            ordenProveedor.orden.estado === EstadoOrden.COMPLETADO) {
                throw new BadRequestException('No se puede cancelar la orden');
        }

        if(ordenProveedor.estado === EstadoOrdenProveedor.CANCELADO){
            throw new BadRequestException('El proveedor no puede volver a cancelar la orden');
        }

        await this.cancelarOrdenProveedorInterno(ordenProveedor);

        await this.ordenProveedorRepository.save(ordenProveedor);

        await this.recalcularOrden(ordenProveedor.orden.id);

        return {
            mensaje: 'Proveedor cancelado correctamente',
            ordenProveedor
        };
    }

    private async recalcularOrden(idOrden: number) {

        const orden = await this.ordenRepository.findOne({
            where: { id: idOrden },
            relations: ['ordenesProveedor']
        });

        if (!orden) return;

        const proveedores = orden.ordenesProveedor;

        const todosCancelados = proveedores.every(
            p => p.estado === EstadoOrdenProveedor.CANCELADO
        );

        const algunosCancelados = proveedores.some(
            p => p.estado === EstadoOrdenProveedor.CANCELADO
        );

        if (todosCancelados) {
            orden.estado = EstadoOrden.CANCELADO;
        } else if (algunosCancelados) {
            orden.estado = EstadoOrden.PARCIAL;
        } else {
            orden.estado = EstadoOrden.EN_PROCESO;
        }

        let total = 0;

        for (const p of proveedores) {
            if (p.estado !== EstadoOrdenProveedor.CANCELADO) {
                total += Number(p.subtotal);
            }
        }

        orden.total = total;

        await this.ordenRepository.save(orden);
    }
}
