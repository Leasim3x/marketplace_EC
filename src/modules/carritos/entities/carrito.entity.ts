import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Cliente } from "src/modules/clientes/entities/cliente.entity";

import { CarritoEstado } from "../enums/carrito-status.enum";
import { CarritoItem } from "src/modules/carrito_items/entities/carrito-item.entity";

@Entity('carritos')
export class Carrito {

    @PrimaryGeneratedColumn({ name: 'id_carrito' })
    id: number;

    @Column({
        type: 'enum',
        enum: CarritoEstado,
        default: CarritoEstado.ACTIVO,
        comment: 'activo: selección de productos, en proceso: pasarela de pago, abandonado: compra no concluida'
    })
    estado: CarritoEstado;

    @CreateDateColumn({ name: 'fecha_creacion' })
    fechaCreacion: Date;

    @ManyToOne(() => Cliente)
    @JoinColumn({ name: 'id_cliente' })
    cliente: Cliente;

    @OneToMany(() => CarritoItem, item => item.carrito,{
        cascade: true
    })
    items: CarritoItem[];

}