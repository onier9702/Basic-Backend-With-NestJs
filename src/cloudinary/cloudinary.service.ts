import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, UploadApiOptions, ResourceApiOptions, v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {

    // async uploadFile( file: Express.Multer.File ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    async uploadFile( pathUrl: string, typeFile: string ): Promise<any> {
        
        const options: ResourceApiOptions = {
            resource_type: "auto"
        }

        if ( typeFile === 'sample') {
            
            return new Promise((resolve, reject) => {
              cloudinary.uploader.upload( pathUrl, options, (error, result) => {
                if (error) return reject(error);
                console.log('Result Cloudinary: ', result);
                resolve(result);
              });
            
            });
            // return new Promise((resolve, reject) => {
            //   const upload = cloudinary.uploader.upload_stream((error, result) => {
            //     if (error) return reject(error);
            //     console.log('Result Cloudinary: ', result);
            //     resolve(result);
            //   });
            
            //   toStream(file.buffer).pipe(upload);
            // });
        }

        if ( typeFile === 'video') {

            return new Promise( (resolve, reject) => {
                
                cloudinary.uploader.upload_large( pathUrl, options, (err, result) => {
                    if (err) {
                        console.log('Error Reject in Cloudinary Service: ', err);
                        reject(err);
                    }
                    resolve(result);
                } );
            })
        }        
        
   
    }

}
