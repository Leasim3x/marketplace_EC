import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';


import { ClientesService } from './clientes.service';
import { RegistrarClienteDto } from './dto/crear-cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';

@Controller('clientes')
export class ClientesController {

    constructor(private readonly clienteService: ClientesService) { }

    @Post()
    registrarCliente(@Body() registrarClienteDto: RegistrarClienteDto) {

        return this.clienteService.registrarCliente(registrarClienteDto);

    }

    @Get()
    listarClientes() {

        return this.clienteService.listarClientes();

    }

    @Get(':id')
    obtenerCliente(@Param('id') id: number) {

        return this.clienteService.obtenerCliente(id);

    }

    @Patch(':id')
    actualizarCliente(@Param('id') id: number, @Body() data: ActualizarClienteDto) {

        return this.clienteService.actualizarCliente(id, data);

    }

    @Patch('desactivar/:id')
    desactivarCliente(@Param(':id', ParseIntPipe) id: number) {

        return this.clienteService.desactivarCliente(id);

    }

    @Patch('activar/:id')
    activarCliente(@Param('id', ParseIntPipe) id: number) {

        return this.clienteService.activarCliente(id);

    }

}
