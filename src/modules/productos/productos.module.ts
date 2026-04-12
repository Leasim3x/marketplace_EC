import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Empresa } from '../empresas/entities/empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Empresa])],
  controllers: [ProductosController],
  providers: [ProductosService]
})
export class ProductosModule { }
