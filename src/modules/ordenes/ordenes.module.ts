import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden } from './entities/orden.entity';

import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { OrdenProveedor } from '../orden_proveedores/entities/orden-proveedor.entity';
import { OrdenItem } from '../orden_items/entities/orden-item.entity';

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
    ],
    controllers: [OrdenesController],
    providers: [OrdenesService]
})
export class OrdenesModule { }
