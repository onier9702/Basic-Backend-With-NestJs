import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UnauthorizedException } from '@nestjs/common';


import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../general/pagination/pagination.dto';
import { Auth } from '../auth/entities/auth.entity';
import { GetUser, AuthDecorator } from '../auth/decorators';
import { ListRoles } from '../auth/interfaces/list-roles';
import { ListDataUser } from '../auth/interfaces/list-data-user';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @AuthDecorator()
  create(
    @GetUser() user: Auth,
    @Body() createProductDto: CreateProductDto
    ) {
    return this.productService.create(createProductDto, user );
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.productService.findAll( paginationDto );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @AuthDecorator()
  update(
    @GetUser(ListDataUser.uid) uid: number,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ){
    return this.productService.update(+id, updateProductDto, uid);
  }

  @Delete(':id')
  @AuthDecorator()
  remove(
    @GetUser(ListDataUser.uid) uid: number,
    @Param('id') id: string
  ) {
    return this.productService.remove(+id, uid);
  }

  @Put('delete-many')
  deleteMany(
    @Body() data: any
  ){
    console.log(data);
    
    return this.productService.deleteMany( data );
  }
}
