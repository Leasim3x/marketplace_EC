import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Carrito } from './entities/carrito.entity';
import { CarritoItem } from '../carrito_items/entities/carrito-item.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { CarritoEstado } from './enums/carrito-status.enum';
import { Producto } from '../productos/entities/producto.entity';

import { AgregarProductoDto } from './dto/agregar-producto.dto';
import { OrdenesService } from '../ordenes/ordenes.service';
import { ActualizarCantidadDto } from './dto/actualizar-cantidad.dto';

@Injectable()
export class CarritosService {

    constructor(

        @InjectRepository(Carrito)
        private carritoRepository: Repository<Carrito>,

        @InjectRepository(CarritoItem)
        private itemRepository: Repository<CarritoItem>,

        @InjectRepository(Producto)
        private productoRepository: Repository<Producto>,

        @InjectRepository(Cliente)
        private clienteRepository: Repository<Cliente>,

        @Inject(forwardRef(() => OrdenesService))
        private ordenService: OrdenesService,

    ) { }

    // DRY (Don't Repeat Yourself)
    private async crearCarritoInterno(cliente: Cliente) {

        const carrito = this.carritoRepository.create({
            cliente,
            estado: CarritoEstado.ACTIVO
        });

        return this.carritoRepository.save(carrito);

    }

    async crearCarrito(idCliente: number) {

        const cliente = await this.clienteRepository.findOne({
            where: { id: idCliente }
        });

        if (!cliente) {
            throw new NotFoundException('Cliente no encontrado');
        }

        return this.crearCarritoInterno(cliente);

    }

    async obtenerOCrearCarrito(idCliente: number) {

        let carrito = await this.carritoRepository.findOne({
            where: {
                cliente: { id: idCliente },
                estado: CarritoEstado.ACTIVO
            },
            relations: ['items', 'items.producto']
        });

        if (!carrito) {

            const cliente = await this.clienteRepository.findOne({
                where: { id: idCliente }
            });

            if (!cliente) {
                throw new NotFoundException('Cliente no encontrado');
            }

            carrito = await this.crearCarritoInterno(cliente);

            carrito.items = [];

        }

        return carrito;

    }

    async obtenerCarrito(idCliente: number) {

        const carrito = await this.carritoRepository.findOne({
            where: {
                cliente: { id: idCliente },
                estado: CarritoEstado.ACTIVO
            },
            relations: ['items', 'items.producto']
        });

        if (!carrito) {
            throw new NotFoundException('Carrito no encontrado');
        }

        return carrito;

    }

    async agregarProducto(data: AgregarProductoDto & {idCliente: number }) {

        const { idCliente, idProducto, cantidad } = data;

        if (cantidad <= 0) {
            throw new BadRequestException('Cantidad inválida');
        }

        const carrito = await this.obtenerOCrearCarrito(idCliente);

        const producto = await this.productoRepository.findOne({
            where: { id: idProducto }
        });

        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }

        if (!producto.activo) {
            throw new BadRequestException('Producto inactivo');
        }

        // Validación opcional de stock
        if (cantidad > producto.stock) {
            throw new BadRequestException('Cantidad supera stock disponible');
        }

        let item = carrito.items.find(i => i.producto.id === idProducto);

        if (item) {
            item.cantidad += cantidad;
        } else {
            item = this.itemRepository.create({
                carrito,
                producto,
                cantidad
            });
        }

        return this.itemRepository.save(item);

    }

    async actualizarCantidad(idItem: number, data: ActualizarCantidadDto) {

        const { cantidad } = data;

        if (cantidad <= 0) {
            throw new BadRequestException('Cantidad inválida');
        }

        const item = await this.itemRepository.findOne({
            where: { id: idItem },
            relations: ['producto']
        });

        if (!item) {
            throw new NotFoundException('Item no encontrado');
        }

        if (cantidad > item.producto.stock) {
            throw new BadRequestException('Cantidad supera stock disponible');
        }

        item.cantidad = cantidad;

        return this.itemRepository.save(item);

    }

    async eliminarProducto(idItem: number) {

        const item = await this.itemRepository.findOne({
            where: { id: idItem }
        });

        if (!item) {
            throw new NotFoundException('Item no encontrado');
        }

        return this.itemRepository.remove(item);

    }

    async vaciarCarrito(idCliente: number) {

        const carrito = await this.obtenerCarrito(idCliente);

        await this.itemRepository.delete({
            carrito: { id: carrito.id }
        });

        return { mensaje: 'Carrito vaciado correctamente' }

    }

    async checkout(idCliente: number) {

        // 1. Obtener carrito activo
        const carrito = await this.carritoRepository.findOne({
            where: {
                cliente: { id: idCliente },
                estado: CarritoEstado.ACTIVO
            },
            relations: ['items', 'items.producto']
        });

        if (!carrito) {
            throw new NotFoundException('Carrito no encontrado');
        }

        // 2. Validar que tenga productos
        if (!carrito.items || carrito.items.length === 0) {
            throw new BadRequestException('El carrito está vacío');
        }

        // 3. Transformar carrito --> productos para orden
        const productos = await carrito.items.map(item => ({
            id_producto: item.producto.id,
            cantidad: item.cantidad
        }));

        // 4. Crear orden (reutilizando la lógica existente)
        const orden = await this.ordenService.crearOrden({
            id_cliente: idCliente,
            productos
        });

        // 5. Cambiar estado del carrito
        carrito.estado = CarritoEstado.CONVERTIDO;

        await this.carritoRepository.save(carrito);

        // 6. Crear nuevo carrito activo
        await this.crearCarrito(idCliente);

        return {
            mensaje: 'Compra realizada correctamente',
            orden
        };

    }
}
