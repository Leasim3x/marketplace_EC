import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarritoItem } from './entities/carrito-item.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CarritoItem
        ]),
    ],
})
export class CarritoItemsModule {}
