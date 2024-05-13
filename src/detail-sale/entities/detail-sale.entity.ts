import { Product } from "src/products/entities/product.entity";
import { Sale } from "src/sale/entities/sale.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity()
export class DetailSale {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product)
    product: Product

    @RelationId((detailSale: DetailSale) => detailSale.product)
    productId: number;

    @Column()
    cantidad: number;

    @Column()
    total: number;

    @ManyToOne(() => Sale)
    sale: Sale;

    @RelationId((detailSale: DetailSale) => detailSale.sale)
    saleId: number;
}
