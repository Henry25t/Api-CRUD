import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Like, Repository } from 'typeorm';
import { SearchRoleDto } from './dto/search-role.dto';
import { delay } from 'rxjs';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>
  ) { }
  async create({ name }: CreateRoleDto) {
    try {
      const role = await this.rolRepository.create({ name: name })
      if (!role) {
        return {
          ok: false,
          message: "No se pudo crear el Rol",
          status: HttpStatus.CONFLICT
        }
      }
      await this.rolRepository.save(role)
      return {
        ok: true,
        role,
        status: HttpStatus.CREATED
      }
    } catch (error) {
      return {
        ok: false,
        message: "Ocurrió un error",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findAll({ name, limit, page }: SearchRoleDto) {
    try {
      const [roles, total] = await this.rolRepository.findAndCount({
        where: {
          name: Like(`%${name}%`),
          isActive: true
        },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(roles)
      if (roles.length > 0) {
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          ok: true,
          roles,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }
      return {
        ok: false, message: "Rol not found", status: HttpStatus.NOT_FOUND
      }
    } catch (error) {
      return{
        ok:false,
        message: "¡Error en el servidor¡",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.rolRepository.findOne({ where: { id, isActive: true } })
      if (!role) {
        return {
          ok: false,
          message: `no se encontró ningún rol con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }
      return {
        ok: true,
        role,
        status: HttpStatus.OK
      }
    } catch (error) {
      return {
        ok: false,
        message: "Ocurrió un error en el servidor",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async update(id: number, { name }: UpdateRoleDto) {
    try {
      const role = await this.rolRepository.findOne({ where: { id, isActive: true } })
      if (!role) {
        return {
          ok: false,
          message: `no se encontró el rol con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }
      role.name = name
      await this.rolRepository.save(role)
      return {
        ok: false,
        role,
        status: HttpStatus.CREATED
      }
    } catch (error) {
      return {
        ok: false,
        message: `Ocurrió un error en el servidor`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async remove(id: number) {
    try {
      const role = await this.rolRepository.findOne({ where: { id, isActive: true } })
      if (!role) {
        return {
          ok: false,
          message: `no se encontró el rol con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }
      role.isActive = false
      await this.rolRepository.save(role)
      return {
        ok: true,
        role,
        
        status: HttpStatus.OK
      }
    } catch (error) {
      return{
        ok: false,
        message: `Ocurrió un error en el servidor`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }
}
