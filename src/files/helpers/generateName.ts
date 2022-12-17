
import { v4 as uuid } from 'uuid';

export const generateName = ( req: Express.Request, 
    file: Express.Multer.File, 
    callback: Function
) => {
    
    const fileExtension = file.mimetype.split('/')[1];
    const nameGenerated = `${uuid()}.${fileExtension}`;

    return callback(null, nameGenerated)    
    
}