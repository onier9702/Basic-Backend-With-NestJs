import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    CloudinaryModule
  ]
})
export class FilesModule {}
