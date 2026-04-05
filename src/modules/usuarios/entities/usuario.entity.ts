import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn({ name: 'id_usuario' })
    id: number;

    @Column()
    nombre: string;

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

}