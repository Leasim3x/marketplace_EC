import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CrearEmpresaDto } from './dto/crear-empresa.dto';
import { NumericType } from 'typeorm';
import { ActualizarEmpresaDto } from './dto/actualizar-empresa.dto';

@Controller('empresas')
export class EmpresasController {

    constructor(private readonly empresasService: EmpresasService) { }

    @Post()
    crearEmpresa(@Body() crearEmpresaDto: CrearEmpresaDto) {

        return this.empresasService.crearEmpresa(crearEmpresaDto);

    }

    @Get()
    listarEmpresas() {

        return this.empresasService.listarEmpresas();

    }

    @Get(':id')
    obtenerEmpresa(@Param('id') id: number) {

        return this.empresasService.obtenerEmpresa(id);

    }

    @Patch(':id')
    actualizarEmpresa(@Param('id') id: number, @Body() actualizarEmpresaDto: ActualizarEmpresaDto) {

        return this.empresasService.actualizarEmpresa(id, actualizarEmpresaDto);

    }

    @Delete(':id')
    eliminarEmpresa(@Param('id') id: number) {

        return this.empresasService.eliminarEmpresa(id);

    }
}
