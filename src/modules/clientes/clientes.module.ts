import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientesService } from './clientes.service';
import { Cliente } from './entities/cliente.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { ClientesController } from './clientes.controller';

@Module({
  imports: [TypeOrmModule.forFeature ([Cliente, Usuario])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService]
})
export class ClientesModule {}
