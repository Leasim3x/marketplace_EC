import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Proveedor } from './entities/proveedor.entity';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
    imports:[TypeOrmModule.forFeature([
        Proveedor,
        Usuario,
    ])],
    providers: [ProveedoresService],
    controllers: [ProveedoresController],
    exports: [ProveedoresService],
    
})
export class ProveedoresModule {}
