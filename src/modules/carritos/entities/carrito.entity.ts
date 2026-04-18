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
        comment: `
        activo: el cliente está agregando productos,
        en_proceso: el cliente inició el checkout,
        abandonado: el cliente no finalizó la compra,
        convertido: el carrito fue transformado en una orden
        `
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