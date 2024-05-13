import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { SearProductDto } from './dto/search-Product.dto';
import { retry } from 'rxjs';
import { ok } from 'assert';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }
  async create({ code, name, price, stock }: CreateProductDto) {
    try {
      const product = await this.productRepository.create({
        name: name,
        code: code,
        stock: stock,
        price: price
      })
      await this.productRepository.save(product)
      return {
        ok: true,
        product,
        status: HttpStatus.CREATED
      }
    } catch (error) {
      return {
        ok: false,
        message: "!Ocurrió un error en el servidor¡",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findAll({ code, limit, name, page }: SearProductDto) {
    try {
      const [products, total] = await this.productRepository.findAndCount({
        where: {
          name: Like(`%${name}%`),
          code: Like(`%${code}%`),
          isActive: true
        },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(products)
      if (products.length > 0) {
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          ok: true,
          products,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }
      return {
        ok: false,
        message: "Products not found",
        status: HttpStatus.NOT_FOUND
      }
    } catch (error) {
      return {
        ok: false,
        message: "¡!Ocurrió un error en el servidor¡",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne({ where: { id, isActive: true } })
      if (!product) {
        return {
          ok: false,
          message: `no se encontró ningún producto con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }
      return {
        ok: true,
        product,
        status: HttpStatus.OK
      }
    } catch (error) {
      return {
        ok: false,
        message: "!Ocurrió un error en el servidor",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async update(id: number, { code, name, price, stock }: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOne({ where: { id, isActive: true } })
      if (!product) {
        return {
          ok: false,
          message: `no se encontró ningún producto con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }
      product.name = name,
        product.code = code,
        product.stock = stock,
        product.price = price
      await this.productRepository.save(product)
      return {
        ok: true,
        product,
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

  async remove(id: number) {
    try {
      const product = await this.productRepository.findOne({ where: { id, isActive: true } })
      if (!product) {
        return {
          ok: false,
          message: `no se encontró el producto con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }

      product.isActive = false;
      await this.productRepository.save(product)
      return{
        ok: true,
        message: "Eliminado exitoso",
        status: HttpStatus.OK
      }
    } catch (error) {
      return{
        ok: false,
        message: "Ocurrió un error en el servidor",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }
}
