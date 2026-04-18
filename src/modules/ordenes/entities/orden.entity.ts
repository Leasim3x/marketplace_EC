import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Cliente } from "src/modules/clientes/entities/cliente.entity";
import { OrdenProveedor } from "src/modules/orden_proveedores/entities/orden-proveedor.entity";
import { EstadoOrden } from "../enums/orden-status.enum";

@Entity('ordenes')
export class Orden {

    @PrimaryGeneratedColumn({ name: 'id_orden' })
    id: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0
    })
    total: number;

    @CreateDateColumn({ name: 'fecha_creacion' })
    fecha: Date;

    @Column({
        type: 'enum',
        enum: EstadoOrden,
        default: EstadoOrden.PENDIENTE,
        comment: `
        pendiente: orden creada pero aún no procesada,
        en_proceso: al menos un proveedor está trabajando en la orden,
        parcial: uno o más proveedores han sido cancelados pero otros siguen activos,
        completado: todos los proveedores han completado la orden,
        cancelado: todos los proveedores han sido cancelados
        `
    })
    estado: EstadoOrden;

    @ManyToOne(() => Cliente)
    @JoinColumn({ name: 'id_cliente' })
    cliente: Cliente;

    @OneToMany(() => OrdenProveedor, op => op.orden, {
        cascade: true
    })
    ordenesProveedor: OrdenProveedor[];
}