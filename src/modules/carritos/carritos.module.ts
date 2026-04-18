import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Carrito } from './entities/carrito.entity';
import { CarritosService } from './carritos.service';
import { CarritoItem } from '../carrito_items/entities/carrito-item.entity';
import { CarritosController } from './carritos.controller';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Orden } from '../ordenes/entities/orden.entity';
import { OrdenProveedor } from '../orden_proveedores/entities/orden-proveedor.entity';
import { OrdenItem } from '../orden_items/entities/orden-item.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';

import { OrdenesModule } from '../ordenes/ordenes.module';
import { OrdenesService } from '../ordenes/ordenes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Carrito,
            CarritoItem,
            Producto,
            Cliente,
            Orden,
            OrdenProveedor,
            OrdenItem,
            Proveedor,
        ]),
        forwardRef(() => OrdenesModule),
    ],
    providers: [
        CarritosService,
    ],
    controllers: [CarritosController],
    exports: [CarritosService]
})
export class CarritosModule {}
