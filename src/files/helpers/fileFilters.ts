import { BadRequestException } from "@nestjs/common";


export const myFileFilter = ( req: Express.Request, 
    file: Express.Multer.File, 
    callback: Function
) => {

    if (!file) return callback(new BadRequestException('File is empty'), false);
    
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = [ 'jpg', 'jpeg', 'png','mp4', 'mpeg', 'mov' ];

    if ( validExtensions.includes( fileExtension ) ) {
        return callback( null, true );
    }
    
    return callback(new BadRequestException(`The extension ${fileExtension} is not permitted`), false);
}