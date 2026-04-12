import { Cliente } from 'src/modules/clientes/entities/cliente.entity';
import { Proveedor } from 'src/modules/proveedores/entities/proveedor.entity';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn({ name: 'id_usuario' })
    id: number;

    @Column()
    nombre: string;

    @Column({ name: 'apellido_paterno' })
    apellidoPaterno: string;

    @Column({ name: 'apellido_materno', nullable: true })
    apellidoMaterno: string;

    @Column({ type: 'date', name: 'fecha_nacimiento', nullable: true })
    fechaNacimiento: Date;

    @Column({ unique: true })
    email: string;
    
    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ['google', 'facebook', 'local'],
        default: 'local'
    })
    provider: string;

    @CreateDateColumn({ name: 'fecha_registro' })
    fechaRegistro: Date;

    @Column({ default: true })
    activo: boolean;

    @OneToOne(() => Cliente, (cliente) => cliente.usuario)
    cliente: Cliente;

    @OneToOne(() => Proveedor, (proveedor) => proveedor.usuario)
    proveedor: Proveedor;

}