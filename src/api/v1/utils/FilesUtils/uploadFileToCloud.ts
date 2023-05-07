import path from "path";
import { Readable } from "stream";
import cloudinary from "../../../../config/cloudinaryConfig";
import deleteLocalFile from "./deleteLocalFile";
import { RequestFileType } from "v1/middlewares/uploadFile";

export default function uploadFileToCloud (file:RequestFileType, folder?:string) {
    return new Promise<string>((resolve, reject) => {
        if(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'].includes(file.mimetype || file.type!)) {

            const filePublicId = file.originalname.substring(0, file.originalname.lastIndexOf('.')).replace(' ', '_') + 
                                file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)

            if(file?.buffer) {
                const stream =  cloudinary.uploader.upload_stream(
                            { 
                                folder: `${process.env.CLOUDINARY_BASE_FOLDER}/${folder}`,
                                resource_type: 'auto',
                                public_id: filePublicId,
                                unique_filename: true
                            }, 
                            (error:any, result:any)=> {
                                if(error) reject(error);

                                const absPath:string = path.resolve(file.path)
                                deleteLocalFile(absPath)
                                .then(()=> {
                                    console.log(`File with path ${absPath} has been deleted from disk`)
                                })
                                .catch((error)=> {
                                    console.log(`Error deleting file with path ${absPath} from disk: `, error)
                                })
                                .finally(()=> {
                                    resolve(result?.secure_url)
                                })
                            })

                Readable.from(file.buffer).pipe(stream);
            }
            else {
                cloudinary.uploader.upload(file.path, {
                    folder: `${process.env.CLOUDINARY_BASE_FOLDER}/${folder}`,
                    resource_type: 'auto',
                    public_id: filePublicId,
                    unique_filename: true
                })
                .then((result)=> {
                    const absPath:string = path.resolve(file.path)
                    deleteLocalFile(absPath)
                    .then(()=> {
                        console.log(`File with path ${absPath} has been deleted from disk`)
                    })
                    .catch(()=> {
                        console.log(`Error deleting file with path ${absPath} has from disk`)
                    })
                    .finally(()=> {
                        console.log(result)
                        console.log(result.url)
                        resolve(result?.secure_url)
                    })
                })
                .catch((error)=> {
                    reject(error);
                })
            }
        }
        else reject({ message: `File type ${file?.mimetype} not supported` });
    });
}