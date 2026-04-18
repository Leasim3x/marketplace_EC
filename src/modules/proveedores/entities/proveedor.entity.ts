import { Empresa } from 'src/modules/empresas/entities/empresa.entity';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('proveedores')
export class Proveedor {

    @PrimaryGeneratedColumn({ name: 'id_proveedor' })
    id: number;

    @Column()
    nombre: string;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ nullable: true })
    direccion: string;

    @Column({ nullable: true })
    telefono: string;

    @Column({ name: 'logo_url', nullable: true })
    logoUrl: string;

    @CreateDateColumn({ name: 'fecha_registro' })
    fechaRegistro: Date;

    @Column({ default: true })
    activo: boolean;

    @OneToOne(() => Usuario, (usuario) => usuario.proveedor)
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @OneToMany(() => Empresa, empresa => empresa.proveedor)
    empresas: Empresa[];

}