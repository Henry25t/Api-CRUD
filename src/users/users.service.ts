import { HttpStatus, Injectable } from '@nestjs/common';
import { SaveUsers } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Address } from 'src/addresses/entities/address.entity';
import { Role } from 'src/roles/entities/role.entity';
import { SearchUserDto } from './dto/search-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositorio: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepositorio: Repository<Address>,
    @InjectRepository(Role)
    private readonly roleRepositorio: Repository<Role>
  ) { }
  async create({ name, lastName, email, password, rolId, department, municipality, complement }: SaveUsers) {
    try {
      const role = await this.roleRepositorio.findOne({ where: { id: rolId, isActive: true } })
      if (!role) {
        return {
          ok: false,
          message: `no se encontró ningún rol con el id ${rolId}`,
          status: HttpStatus.NOT_FOUND
        }
      }

      const address = await this.addressRepositorio.save({
        department: department,
        municipality: municipality,
        complement: complement
      })

      const user = await this.userRepositorio.create({
        name: name,
        lastName: lastName,
        email: email,
        password: password,
        address: address,
        rol: role
      });
      user.hashPassword()
      await this.userRepositorio.save(user)

      return {
        ok: true,
        user,
        status: HttpStatus.CREATED
      }
    } catch (error) {
      return {
        ok: false,
        message: "¡Ocurrió un error en el servidor!",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findAll({ email, lastName, limit, name, page }: SearchUserDto) {
    try {
      const [users, total] = await this.userRepositorio.findAndCount({
        where: {
          name: Like(`%${name}%`),
          lastName: Like(`%${lastName}%`),
          email: Like(`%${email}%`),
          isActive: true
        },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(users)
      if (users.length > 0) {
        for (const user of users) { user.password = undefined }
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          ok: true,
          users,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }
      return {
        ok: false, message: "User not found", status: HttpStatus.NOT_FOUND
      }
    } catch (error) {
      return {
        ok: false,
        message: "¡Error en el servidor!",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepositorio.findOne({ where: { id, isActive: true } })
      if (!user) {
        return {
          ok: false,
          message: `No se encontró ningún usuario con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }

      user.password = undefined

      return {
        ok: true,
        user,
        status: HttpStatus.OK
      }
    } catch (error) {
      return {
        ok: false,
        message: "¡Error en el servidor!",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async update(id: number, { email, lastName, name, password, rolId, complement, department, municipality }: SaveUsers) {
    try {
      const user = await this.userRepositorio.findOne({ where: { id, isActive: true }, relations: ['address', 'rol'] });
      const role = await this.roleRepositorio.findOne({ where: { id: rolId, isActive: true } });
      if (!user) {
        return {
          ok: false,
          message: `No se encontró el usuario con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }
      if (!role){
        return {
          ok: false,
          message: `No se encontró el rol con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }

      user.name = name,
      user.lastName = lastName,
      user.email = email,
      user.password = password,
      user.rol = role
      if (department || municipality || complement) {
        user.address.department = department,
        user.address.municipality = municipality,
        user.address.complement = complement
        await this.addressRepositorio.save(user.address)
      }

      user.hashPassword()
      await this.userRepositorio.save(user)
      return {
        ok: true,
        user,
        status: HttpStatus.OK
      }

    } catch (error) {
      return {
        ok: false,
        message: "!Ocurrió un error en el servidor¡" + error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepositorio.findOne({ where: { id, isActive: true } })
      user.isActive = false
      await this.userRepositorio.save(user)
      return {
        ok: true,
        message: "Se elimino correctamente",
        status: HttpStatus.OK
      }
    } catch (error) {
      return {
        ok: false,
        message: "!Ocurrió un error en el servidor¡",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }
}
