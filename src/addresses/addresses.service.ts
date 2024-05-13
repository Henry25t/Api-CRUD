import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Like, Repository } from 'typeorm';
import { SearchAddressDto } from './dto/search-address.dto';
import { ok } from 'assert';
import { debugPort } from 'process';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) { }
  async create({ department, complement, municipality }: CreateAddressDto) {
    try {
      const address = await this.addressRepository.create({
        department: department,
        municipality: municipality,
        complement: complement
      })
      if (!Address) {
        return {
          ok: false,
          message: "no se pudo crear la dirección",
          status: HttpStatus.CONFLICT
        }
      }
      await this.addressRepository.save(address)
      return {
        ok: true,
        address,
        status: HttpStatus.CREATED
      }
    } catch (error) {
      return {
        ok: false,
        message: "¡Error en el servidor!",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findAll({ department, municipality, complement, limit, page }: SearchAddressDto) {
    try {
      const [addresses, total] = await this.addressRepository.findAndCount({
        where: {
          department: Like(`%${department}%`),
          municipality: Like(`%${municipality}%`),
          complement: Like(`%${complement}%`),
          isActive: true
        },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(addresses)
      if (addresses.length > 0) {
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          ok: true,
          addresses,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }
      return {
        ok: false, message: "Addresses not found", status: HttpStatus.NOT_FOUND
      }
    } catch (error) {
      return {
        ok: false,
        message: "¡Error en el servidor!",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }
    }
  }

  async findOne(id: number) {
    try {
      const address = await this.addressRepository.findOne({ where: { id, isActive: true } })
      if (!address) {
        return {
          ok: false,
          message: `no se encontró la dirección con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }
      return {
        ok: true,
        address,
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

  async update(id: number, { department, municipality, complement }: UpdateAddressDto) {
    try {
      const address = await this.addressRepository.findOne({ where: { id, isActive: true } })
      if(!address){
        return{
          ok: false,
          message: "no se encontró la dirección con el id " + {id},
          status: HttpStatus.NOT_FOUND
        }
      }
      address.department = department,
      address.municipality = municipality,
      address.complement = complement
      await this.addressRepository.save(address)
      return{
        ok:true,
        address,
        status: HttpStatus.OK
      }

    } catch (error) {
      return{
        ok: false,
        message: "¡Error en el servidor",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async remove(id: number) {
    try {
      const address = await this.addressRepository.findOne({where: {id, isActive: true}})
      if(!address){
        return{
          ok: false,
          message: `No se encontró la dirección con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }
      address.isActive = false
      await this.addressRepository.save(address)
      return{
        ok: true,
        address,
        status: HttpStatus.OK
      }
    } catch (error) {
      return{
        ok: false,
        message: "¡Error en el servidor!",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }
}
