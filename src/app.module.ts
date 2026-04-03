import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { EmpresasModule } from './empresas/empresas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { CarritosModule } from './carritos/carritos.module';
import { CarritoItemsModule } from './carrito_items/carrito_items.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { OrdenItemsModule } from './orden_items/orden_items.module';
import { OrdenProveedoresModule } from './orden_proveedores/orden_proveedores.module';
import { PagosModule } from './pagos/pagos.module';

@Module({
  imports: [UsuariosModule,
    ClientesModule,
    ProveedoresModule,
    EmpresasModule,
    CategoriasModule,
    ProductosModule,
    CarritosModule,
    CarritoItemsModule,
    OrdenesModule,
    OrdenItemsModule,
    OrdenProveedoresModule,
    PagosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
