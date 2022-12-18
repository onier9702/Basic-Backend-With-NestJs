import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

import { Product } from './entities/product.entity';
import { ProductImages } from './entities/product-images.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [

    TypeOrmModule.forFeature([ Product, ProductImages ]),
    AuthModule

  ],
  exports: [
    TypeOrmModule,
    ProductService
  ]

})
export class ProductModule {}
