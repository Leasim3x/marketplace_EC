import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden } from './entities/orden.entity';

import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { OrdenProveedor } from '../orden_proveedores/entities/orden-proveedor.entity';
import { OrdenItem } from '../orden_items/entities/orden-item.entity';
import { CarritosModule } from '../carritos/carritos.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Orden,
            OrdenProveedor,
            OrdenItem,
            Producto,
            Cliente,
            Proveedor
        ]),
        forwardRef(() => CarritosModule)
    ],
    controllers: [OrdenesController],
    providers: [OrdenesService],
    exports: [OrdenesService],
})
export class OrdenesModule { }
