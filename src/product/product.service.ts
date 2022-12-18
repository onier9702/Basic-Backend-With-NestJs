import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { ProductImages } from './entities/product-images.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../general/pagination/pagination.dto';
import { Auth } from '../auth/entities/auth.entity';

@Injectable()
export class ProductService {


  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImages)
    private readonly prodImagesRepository: Repository<ProductImages>
  ) {}

  public async create(createProductDto: CreateProductDto, user: Auth) {

    const { name, images = [], ...listProds } = createProductDto;
    const prod = this.productRepository.create({
      name: name.toUpperCase(),
      user,
      ...listProds,
      images: images.map( img =>  this.prodImagesRepository.create( { url: img } ) )
    });

    try {

      const resultedProd = await this.productRepository.save(prod);
      return this.plainResponse( resultedProd );
      
    } catch (error) {
      this.handleExceptionsErrorOnDB(error);
    }
  }

  // Find all Products on DB
  public async findAll( paginationDto: PaginationDto ) {

    const { limit = 4, offset = 0 } = paginationDto;
    try {

      const allProds = await this.productRepository.find({
        take: limit,
        skip: offset,
        // relations: {
        //   images: true   // I thins this is not necessary so cascade was put on TRUE in Product Entity
        // }
      });
      return allProds.map( ( {images, ...rest} ) => ({
        ...rest,
        images: images.map( img => img.url )
      }) )
      
    } catch (error) {
      this.handleExceptionsErrorOnDB( error );
    }
  }

  // Find One By name or ID
  public async findOne(term: string) { 
    
    let product: Product;
      
    // wether term is an ID
    if ( !isNaN(+term) ) {
      product = await this.productRepository.findOneBy( { id: +term } );
    } else {
      // maybe it is name
      const qb = this.productRepository.createQueryBuilder('prod');
      product = await qb
                .where( 'name =:name', { name: term.toUpperCase() } )
                .leftJoinAndSelect('prod.images', 'prodImages')
                .getOne();
    }
 
    if ( !product ) throw new BadRequestException(`Product with terminus: ${term} not found`);
    return {
      ...product,
      images: product.images.map( img => img.url )
    }

  }

  // Update a product
  public async update(id: number, updateProductDto: UpdateProductDto, uid: number) {
    const { name: oldName, ...oldProd } = await this.findOneQuery( id );
    const uidUserDB = oldProd.user.uid;
    if ( uid !== +uidUserDB ) throw new UnauthorizedException(`You does not have permission to update a product of other client, it is not yours`);

    let nameCapitalized: string;
    const { name, images = [], ...newProd } = updateProductDto;

    ( name ) ? nameCapitalized = name.toUpperCase() : nameCapitalized = oldName;

    try {

      if ( images ) {
        // delete the old images of a product
        await this.prodImagesRepository.delete( { product: {id} } );
      }
  
      const product = await this.productRepository.preload({
        name: nameCapitalized,
        ...oldProd,
        ...newProd,
        images: images.map( img => this.prodImagesRepository.create( { url: img } ) )
      });
  
      // const updatedProd = await this.productRepository.update(id, product)
      const updatedProd = await this.productRepository.save(product); // if row does not exists create the new row, otherwise updates
      const { images: imgs = [], user, ...rest } = updatedProd;
      const { password, isActive, roles, ...dataUserDBToFront } = user;
      return {
        ...rest,
        user: {...dataUserDBToFront},
        images: imgs.map( img => img.url )
      }
      
    } catch (error) {
      this.handleExceptionsErrorOnDB(error);
    }

  }

  // Delete one product by ID
  public async remove(id: number, uid?: number) {
    const prod = await this.findOneQuery( id );
    if ( uid ) { // if parameter uid was passed then verify if user from token is the same user with that product he want to delete
      const { uid: uidDB } = prod.user;
      if ( uid !== uidDB ) throw new UnauthorizedException(`You does not have permission to delete a product of other client, it is not yours`);
    }
    const { name, id: idDB } = await this.productRepository.remove(prod)
    return `Product ${name} with ID: ${idDB} was deleted`;
  }

  // Delete many products 
  public async deleteMany( data: any ) {
    const arr: string[] = data.values;
    let arrPromises = [];
    arr.forEach( id => {
      arrPromises.push( this.findOneQuery( +id ) );
    });

    let foundProds = await Promise.all( arrPromises );

    let deletedArrPromises = [];
    foundProds.forEach( prod => {
      deletedArrPromises.push( this.remove( prod.id ) )
    } );

    const deletedProds =  await Promise.all( deletedArrPromises );
    return deletedProds;

  }

  // -------------- HELPERS - Methods -------------------------------//

  private async findOneQuery(id: number) {
    const product = await this.productRepository.findOneBy( { id } );
    if ( !product ) throw new BadRequestException(`Product with ID: ${id} not found`);
    return product;
  }

  // method to plane all images and send necessary data user
  private plainResponse( prod: Product ) {

    const { images = [], user, ...rest } = prod;
    const { password, roles, isActive, ...attributesUserToSendFront } = user;
    return {
      ...rest,
      user: {...attributesUserToSendFront},
      images: images.map( elem => elem.url )
    }
  }

  private handleExceptionsErrorOnDB( err: any ) {
    console.log(err);
    
    const { errno, sqlMessage } = err;    
    if ( errno === 1062 || errno === 1364 ) throw new BadRequestException(sqlMessage);

    throw new InternalServerErrorException(`Error not implemented: check --logs-- in console`);  
    
  }

  // DELETE all products for SEED
  public async deleteAllTables() {
    const qb = this.productRepository.createQueryBuilder('prod');
    try {

      return await qb  
              .where({})
              .delete()
              .execute();
      
    } catch (error) {
      this.handleExceptionsErrorOnDB(error);
    }
  }

}
