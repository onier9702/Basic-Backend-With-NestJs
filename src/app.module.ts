import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/config/db.config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GeneralModule } from './general/general.module';
import { ProductModule } from './product/product.module';


@Module({
  imports: [

    ConfigModule.forRoot(),

    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: +process.env.DB_PORT,
    //   database: 'basic_nest_backend',
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   autoLoadEntities: true,
    //   // synchronize: true
    // }),

    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      synchronize: false
    }),

    AuthModule,

    FilesModule,

    CloudinaryModule,

    GeneralModule,

    ProductModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
