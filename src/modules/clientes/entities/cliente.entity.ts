import { Usuario } from "src/modules/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('clientes')
export class Cliente {

    @PrimaryGeneratedColumn({ name: 'id_cliente' })
    id: number;

    @Column({ nullable: true })
    direccion: string;

    @Column({ nullable: true })
    telefono: string;

    @CreateDateColumn({ name: 'fecha_registro' })
    fechaRegistro: Date;

    @Column({ default: true })
    activo: boolean;

    @OneToOne(() => Usuario, (usuario) => usuario.cliente)
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

}