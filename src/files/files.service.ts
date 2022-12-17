import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';


@Injectable()
export class FilesService {

    constructor( private cloudinaryService: CloudinaryService) {}

    public async postNewFile(
        // file: Express.Multer.File,
        typeFile: string,
        path: string
    ): Promise<any>  {

        const divisionPath = path.split('/');
        const relativePath = divisionPath[ divisionPath.length - 1];
        const pathFromFs = this.getStaticFile(relativePath);
        
        return this.cloudinaryService.uploadFile(pathFromFs, typeFile)
            .then( file => {
                const { secure_url } = file;
                return secure_url;
            })
            .catch(error => {
                console.log('Error in filesService: ', error);
                throw new InternalServerErrorException('An error ocurred uploading the new file');
            })
            .finally( () => {
                // DELETE file from static/uploads
                this.deleteFileFromFs(pathFromFs);
            })
    
    }

    // this is handle files saved on file system that it is not a good practice
    getStaticFile( fileName: string ): string {

        const path = join( __dirname, '../../static/uploads', fileName ); // create a physic path to get image name if it exists
        if ( !existsSync(path) )
        throw new BadGatewayException( `Not file found with path ${fileName}` );

        // if image with that name exists return that name
        return path;
    }

    deleteFileFromFs( path: string ): void {
        unlinkSync(path);
    }
  
}
