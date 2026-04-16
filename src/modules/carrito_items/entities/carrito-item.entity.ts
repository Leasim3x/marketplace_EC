import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

import { Carrito } from "src/modules/carritos/entities/carrito.entity";
import { Producto } from "src/modules/productos/entities/producto.entity";

@Entity('carrito_items')
@Unique(['carrito', 'producto'])
export class CarritoItem {

    @PrimaryGeneratedColumn({ name: 'id_item' })
    id: number;

    @Column({ default: 1 })
    cantidad: number;

    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'id_producto' })
    producto: Producto;

    @ManyToOne(() => Carrito, carrito => carrito.items, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'id_carrito' })
    carrito: Carrito;

}