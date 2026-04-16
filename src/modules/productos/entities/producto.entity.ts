import { Empresa } from "src/modules/empresas/entities/empresa.entity";
import { OrdenItem } from "src/modules/orden_items/entities/orden-item.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('productos')
export class Producto {

    @PrimaryGeneratedColumn({ name: 'id_producto' })
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'decimal' })
    precio: number;

    @Column({ default: 0 })
    stock: number;

    @Column({ name: 'imagen_url', type: 'text', nullable: true })
    imagenUrl: string;

    @CreateDateColumn({ name: 'fecha_registro' })
    fechaRegistro: Date;

    @Column({ default: false })
    activo: boolean;

    @ManyToOne(() => Empresa, empresa => empresa.productos)
    @JoinColumn({ name: 'id_empresa' })
    empresa: Empresa;

    @OneToMany(() => OrdenItem, item => item.producto)
    items: OrdenItem[];

}