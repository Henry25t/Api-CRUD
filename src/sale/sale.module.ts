import { Body, Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Box } from 'src/box/entities/box.entity';
import { Client } from 'src/clients/entities/client.entity';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Box, Client, DetailSale, Product])],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}
