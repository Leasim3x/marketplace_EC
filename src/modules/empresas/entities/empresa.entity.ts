import { Proveedor } from "src/modules/proveedores/entities/proveedor.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('empresas')
export class Empresa{

    @PrimaryGeneratedColumn({ name: 'id_empresa'})
    id: number;

    @Column()
    nombre:string;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ nullable: true })
    direccion: string;

    @Column({ nullable: true })
    telefono: string;

    @Column({ nullable: true })
    email: string;

    @Column({ name: 'logo_url', nullable: true })
    logoUrl: string;

    @CreateDateColumn({ name: 'fecha_registro' })
    fechaRegistro: Date;

    @ManyToOne(() => Proveedor, proveedor => proveedor.empresas)
    @JoinColumn({ name: 'id_proveedor' })
    proveedor: Proveedor;
}