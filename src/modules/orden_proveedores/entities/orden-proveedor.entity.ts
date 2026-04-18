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
        default: EstadoOrdenProveedor.PENDIENTE,
        comment: `
        pendiente: el proveedor ha recibido la orden pero no la ha procesado,
        en_proceso: el proveedor está preparando el pedido,
        enviado: el pedido ha sido despachado,
        entregado: el pedido fue entregado al cliente,
        cancelado: el proveedor canceló su parte de la orden
        `
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