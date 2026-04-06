import { Module } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Proveedor])],
  providers: [EmpresasService],
  controllers: [EmpresasController]
})
export class EmpresasModule { }
