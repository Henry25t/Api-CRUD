import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    department: string;

    @Column()
    municipality: string;

    @Column()
    complement: string;

    @Column({default: true})
    isActive: boolean;
}
