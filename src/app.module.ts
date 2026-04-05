import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ProveedoresModule } from './modules/proveedores/proveedores.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ProductosModule } from './modules/productos/productos.module';
import { CarritosModule } from './modules/carritos/carritos.module';
import { CarritoItemsModule } from './modules/carrito_items/carrito_items.module';
import { OrdenesModule } from './modules/ordenes/ordenes.module';
import { OrdenItemsModule } from './modules/orden_items/orden_items.module';
import { OrdenProveedoresModule } from './modules/orden_proveedores/orden_proveedores.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsuariosModule,
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
    PagosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
