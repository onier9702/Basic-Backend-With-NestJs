import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { myFileFilter } from './helpers/fileFilters';
import { generateName } from './helpers/generateName';

@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}

  @Post(':typeFile')
  @UseInterceptors( FileInterceptor( 'file', {  // nest interceptor 
    fileFilter: myFileFilter, // function callback who return two values. One is an error that 
    //can be null if not error and if it is error then return an error or BadRequestException. 
    //The other one is true or false, to interceptors let continue if true or not if false
    storage: diskStorage({
      destination: './static/uploads',
      filename: generateName
    })
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('typeFile') typeFile: string
    ) {
      
    return await this.filesService.postNewFile(typeFile, file.path);
  }

}
