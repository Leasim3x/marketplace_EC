import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Carrito,
        ]),
    ],
})
export class CarritosModule {}
