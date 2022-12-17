import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity( {name: 'product-images'} )
export class ProductImages {

    @PrimaryGeneratedColumn()
    id: number;

    @Column( { unique: true } )
    url: string;

    @ManyToOne(
        () => Product,
        prod => prod.images,
    )
    product: Product;

}