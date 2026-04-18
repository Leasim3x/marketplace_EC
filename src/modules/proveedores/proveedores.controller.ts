import { Body, Controller, Get, Param, Post, Patch, Delete, Query } from '@nestjs/common';

import { ProveedoresService } from './proveedores.service';
import { CrearProveedorDto } from './dto/crear-proveedor.dto';
import { ActualizarPerfilDto } from '../usuarios/dto/actualizar-perfil.dto';


@Controller('proveedores')
export class ProveedoresController {

    // Contructor resumido
    constructor(private readonly proveedoresService: ProveedoresService) { }

    @Post()
    crearProveedor(
        @Body() crearProveedorDto: CrearProveedorDto,
    ) {
        return this.proveedoresService.crearProveedor(crearProveedorDto);
    }

    @Get()
    listarProveedores() {

        return this.proveedoresService.listarProveedores();

    }

    @Get(':id')
    obtenerProveedor(@Param('id') id: number) {

        return this.proveedoresService.obtenerProveedor(id);

    }

    @Patch(':id')
    actualizarProveedor(@Param('id') id: number, @Body() data: ActualizarPerfilDto) {

        return this.proveedoresService.actualizarProveedor(id, data);

    }

    @Delete('desactivar/:id')
    desactivarProveedor(@Param('id') id: number) {

        return this.proveedoresService.desactivarProveedor(id);

    }

    @Patch('activar/:id')
    activarProveedor(@Param('id') id: number) {

        return this.proveedoresService.activarProveedor(id);

    }
}
