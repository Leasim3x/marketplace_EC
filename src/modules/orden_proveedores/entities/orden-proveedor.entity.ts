import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Proveedor } from "src/modules/proveedores/entities/proveedor.entity";
import { OrdenItem } from "src/modules/orden_items/entities/orden-item.entity";
import { Orden } from "src/modules/ordenes/entities/orden.entity";
import { EstadoOrdenProveedor } from "../enums/orden-proveedor-status.enum";

@Entity('orden_proveedores')
export class OrdenProveedor {

    @PrimaryGeneratedColumn({ name: 'id_orden_proveedor' })
    id: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0
    })
    subtotal: number;

    @Column({
        type: 'enum',
        enum: EstadoOrdenProveedor,
        default: EstadoOrdenProveedor.PENDIENTE
    })
    estado: EstadoOrdenProveedor;

    @ManyToOne(() => Proveedor)
    @JoinColumn({ name: 'id_proveedor' })
    proveedor: Proveedor;

    @ManyToOne(() => Orden, orden => orden.ordenesProveedor, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'id_orden' })
    orden: Orden;

    @OneToMany(() => OrdenItem, item => item.ordenProveedor, {
        cascade: true
    })
    items: OrdenItem[];

}