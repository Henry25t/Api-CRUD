import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    dui: string;

    @Column()
    points: number;

    @Column({default: true})
    isActive: boolean;
}
