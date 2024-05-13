import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Product } from 'src/products/entities/product.entity';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';
import { Box } from 'src/box/entities/box.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(DetailSale)
    private readonly detailSaleRepository: Repository<DetailSale>,
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>,
  ) { }
  async create({ boxId, clientId, date, products, total }: CreateSaleDto) {
    const queryRunner = await this.saleRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const box = await queryRunner.manager.findOne(Box, { where: { id: boxId, isActive: true } });
      const client = await queryRunner.manager.findOne(Client, { where: { id: clientId, isActive: true } });

      if (!box) {
        return {
          ok: false,
          message: `No hay caja abierta con el Id: ${boxId}`,
          status: HttpStatus.NOT_FOUND
        }
      }

      if (!client) {
        return {
          ok: false,
          message: `Cliente con ID ${clientId} no encontrado.`,
          status: HttpStatus.NOT_FOUND
        }
      }

      if (!products) {
        return {
          ok: false,
          message: `Producto con ID ${products} no encontrado.`,
          status: HttpStatus.NOT_FOUND
        }
      }

      const newSale = await queryRunner.manager.save(Sale, {
        date: date as unknown as Date,
        total: total,
        client: client,
        box: box
      })

      let totalPro = 0

      for (const pro of products) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: pro.productId, isActive: true } });
        if (!product || product.isActive === false) {
          return {
            ok: false,
            message: `no se encontró el producto con el id: ${pro.productId}`,
            status: HttpStatus.NOT_FOUND
          }
        }
        await queryRunner.manager.save(DetailSale, {
          product: product,
          cantidad: pro.cantidad,
          total: product.price * pro.cantidad,
          sale: newSale,
        })
        
        totalPro += product.price * pro.cantidad

        if (product.stock >= pro.cantidad) {
          product.stock -= pro.cantidad;
        } else {
          return {
            ok: false,
            message: `stock insuficiente para hacer una venta del producto ${product.name}`
          }
        }

        await queryRunner.manager.save(Product, product);
      }

      client.points += totalPro;
      await queryRunner.manager.save(Client, client);

      box.totalSales += totalPro;
      await queryRunner.manager.save(Box, box);

      newSale.total += totalPro;
      await queryRunner.manager.save(Sale, newSale);

      await queryRunner.commitTransaction();

      return {
        ok: true,
        sale: newSale,
        status: HttpStatus.CREATED
      };
    } catch (error) {
      await queryRunner.rollbackTransaction()
      return {
        ok: false,
        message: `No se pudo crear la venta,  ${error.message}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const sales = await this.saleRepository.find({ relations: ['client'] });
      if (sales.length > 0) {
        return {
          ok: true,
          sales
        }
      }
    } catch (error) {
      return {
        ok: false,
        message: `Error en el servidor`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findOne(id: number) {
    try {
      const searchSales = await this.saleRepository.findOne({ where: { id }, relations: ['client'] })
      if (!searchSales) {
        return {
          ok: false,
          message: `No se encontró ningún registro con el id ${id}`,
          status: HttpStatus.NOT_FOUND
        }
      }
      const sales = {
        id: searchSales.id,
        date: searchSales.date,
        total: searchSales.total,
        client: searchSales.client,
        clientId: searchSales.clientId
      }
      return {
        ok: true,
        sales
      }
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async update(id: number, { date, total, clientId }: UpdateSaleDto) {
    try {
      const sales = await this.saleRepository.findOne({ where: { id } })
      const client = await this.clientRepository.findOne({ where: { id: clientId } });
      const date2: Date = new Date(date);
      sales.date = date2,
        sales.total = total,
        sales.client = client

      await this.saleRepository.save(sales)
      return {
        ok: true,
        sales
      }
    } catch (error) {
      return {
        ok: false,
        message: `Error en el servidor`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async remove(id: number) {
    try {
      const result = await this.saleRepository.delete(id);
      if (result.affected === 0) {
        return {
          ok: false,
          message: `No se encontró ningún Venta con el ID ${id}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR
        }
      }
      return { ok: true, result, }
    } catch (error) {
      return {
        ok: false,
        message: `Error en el servidor`,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }
}
