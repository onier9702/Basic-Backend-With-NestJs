import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

import { Product } from './entities/product.entity';
import { ProductImages } from './entities/product-images.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [

    TypeOrmModule.forFeature([ Product, ProductImages ]),

  ],
  exports: [
    TypeOrmModule,
    ProductService
  ]

})
export class ProductModule {}
