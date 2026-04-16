import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenProveedor } from './entities/orden-proveedor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OrdenProveedor])],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule]
})
export class OrdenProveedoresModule {}
