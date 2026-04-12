import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { ActualizarStockDto } from './dto/actualizar-stock.dto';

@Controller('productos')
export class ProductosController {

    constructor(readonly productosService: ProductosService) { }

    @Post()
    crearProducto(@Body() data: CrearProductoDto) {

        return this.productosService.crearProducto(data);
    }

    @Get()
    listarProductos() {

        return this.productosService.listarTodosProductos();

    }

    @Get('activos')
    listarProductosActivos() {

        return this.productosService.listarActivos();

    }

    @Get('desactivados')
    listarProductosDesactivados() {

        return this.productosService.listarDesactivados();
        
    }

    @Get(':id')
    obtenerProducto(@Param('id') id: number) {

        return this.productosService.obtenerProducto(id);

    }

    @Patch(':id')
    actualizarProducto(@Param('id') id: number, @Body() data: ActualizarProductoDto) {

        return this.productosService.actualizarProducto(id, data);

    }

    @Patch(':id/stock')
    actualizarStock(@Param('id') id: number, @Body() data: ActualizarStockDto) {

        return this.productosService.actualizarStock(id, data);

    }

    @Patch(':id/activar')
    activarProducto(@Param('id') id: number) {

        return this.productosService.activarProducto(id);

    }

    @Patch(':id/desactivar')
    desactivarProducto(@Param('id') id: number) {

        return this.productosService.desactivarProducto(id);

    }
}
