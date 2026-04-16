import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Producto } from "src/modules/productos/entities/producto.entity";
import { OrdenProveedor } from "src/modules/orden_proveedores/entities/orden-proveedor.entity";

@Entity('orden_items')
export class OrdenItem {

    @PrimaryGeneratedColumn({ name: 'id_item' })
    id: number;

    @Column({ default: 1 })
    cantidad: number;

    @Column({
        name: 'precio_unitario',
        type: 'decimal',
        precision: 10, scale: 2
    })
    precioUnitario: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    subtotal: number;

    @ManyToOne(() => Producto, producto => producto.items)
    @JoinColumn({ name: 'id_producto' })
    producto: Producto;

    @ManyToOne(() => OrdenProveedor, op => op.items, {
        onDelete: 'CASCADE'
    })
    ordenProveedor: OrdenProveedor;

}