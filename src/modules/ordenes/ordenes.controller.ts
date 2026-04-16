import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { OrdenesService } from './ordenes.service';
import { CrearOrdenDto } from './dto/crear-orden.dto';
import { ActualizarEstadoOrdenDto } from './dto/actualizar-estado-orden.dto';

@Controller('ordenes')
export class OrdenesController {

    constructor(
        private readonly ordenesService: OrdenesService
    ) { }

    @Post()
    crearOrden(@Body() data: CrearOrdenDto) {

        return this.ordenesService.crearOrden(data);

    }

    @Get()
    obtenerOrdenes() {

        return this.ordenesService.obtenerOrdenes();

    }

    @Get(':id')
    obtenerOrden(@Param('id', ParseIntPipe) id: number) {

        return this.ordenesService.obtenerOrden(id);

    }

    @Patch('estado/:id')
    actualizarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: ActualizarEstadoOrdenDto
    ) {

        return this.ordenesService.actualizarEstado(id, data.estado);

    }

    @Patch('cancelar/:id')
    cancelarOrden(@Param('id', ParseIntPipe) id: number) {

        return this.ordenesService.cancelarOrden(id);

    }

    @Patch('proveedor/:id/cancelar')
    cancelarProveedor(@Param('id', ParseIntPipe) id: number){

        return this.ordenesService.cancelarOrdenProveedor(id);
        
    }

}
