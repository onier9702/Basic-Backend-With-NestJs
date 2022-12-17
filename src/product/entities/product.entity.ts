import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImages } from './product-images.entity';
import { Auth } from '../../auth/entities/auth.entity';


@Entity('products')
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'float', default: 1 })
    price: number;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'numeric', default: 1 })
    stock: number;

    @Column({ type: 'simple-array'})
    sizes: string[];

    @Column()
    gender: string;

    @Column({ type: 'simple-array' })
    tags: string[];

    // Relations
    @OneToMany(
        () => ProductImages,
        imageEntity => imageEntity.product,
        { cascade: true, eager: true }
        // OJO: this cascade on TRUE allow me to create a product and automatically insert children relations on DB,
        // I mean: in productsService was used productRepository.save(product) and NOT productImagesRepository.save(url)
        // this cascade on true allow impact on productImagesrepository automatically
    )
    images?: ProductImages[];

    @ManyToOne(
        () => Auth,
        user => user.product, 
        { eager: true, cascade: true }
    )
    user: Auth;

}