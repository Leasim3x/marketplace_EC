import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CarritosService } from './carritos.service';

import { AgregarProductoDto } from './dto/agregar-producto.dto';
import { ActualizarCantidadDto } from './dto/actualizar-cantidad.dto';

@Controller('carrito')
export class CarritosController {

    constructor(
        private readonly carritoService: CarritosService
    ) {}

    // Obtener carrito activo del cliente
    @Get(':idCliente')
    obtenerCarrito(@Param('idCliente') idCliente: number){
        
        return this.carritoService.obtenerCarrito(idCliente);

    }

    // Agregar producto al carrito
    @Post(':idCliente/items')
    agregarProducto(@Param('idCliente') idCliente: number, @Body() data: AgregarProductoDto){

        return this.carritoService.agregarProducto({
            idCliente,
            ...data
        });

    }

    // Actualizar cantidad de item
    @Patch('items/:idItem')
    actualizarCantidad(
        @Param('idItem', ParseIntPipe) idItem: number,
        @Body() data: ActualizarCantidadDto
    ){
        
        return this.carritoService.actualizarCantidad(idItem, data);

    }

    // Eliminar item del carrito
    @Delete('items/:idItem')
    eliminarProducto(@Param('idItem') idItem: number){

        return this.carritoService.eliminarProducto(idItem);

    }

    // Vaciar carrito
    @Delete(':idCliente/items')
    vaciarCarrito(@Param('idCliente') idCliente: number) {

        return this.carritoService.vaciarCarrito(idCliente);

    }

    // Checkout
    @Post(':idCliente/checkout')
    checkout(@Param('idCliente') idCliente: number){

        return this.carritoService.checkout(idCliente);
        
    }
}
