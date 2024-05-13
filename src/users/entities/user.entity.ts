import { Address } from 'src/addresses/entities/address.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import * as  bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({default: true})
    isActive: boolean;

    @ManyToOne(() => Role)
    rol: Role;

    @RelationId(( user: User) => user.rol)
    rolId: number;

    @ManyToOne(() => Address)
    address: Address

    @RelationId((user: User) => user.address)
    addressId: number

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(contraseña: string): boolean {
        return bcrypt.compareSync(contraseña, this.password);
    }
}
