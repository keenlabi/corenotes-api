import { readFile } from "fs"
import { validateBufferMIMEType } from "validate-image-type";

const MAX_FILE_SIZE:number = parseFloat(process.env.IMAGE_FILE_SIZE!);
const MAX_FILE_SIZE_CAT:string = process.env.IMAGE_FILE_SIZE_CAT!;


export default function validateImageFile(file:any) {
    return new Promise<{message:string}>(async(resolve, reject)=> {
        if(!isFileSizeValid(file)) reject({ message: `File ${file?.originalname} is larger than ${MAX_FILE_SIZE}${MAX_FILE_SIZE_CAT}. Please select another image` });
        isFileImage(file)
        .catch(()=> {
            reject({ message: `File ${file?.originalname} is not a valid image` })
        })

        resolve({message: ''});

    })
}

function isFileSizeValid(file:Express.Multer.File) {
    // convert size into mb
    let fileSize:number = 0;
    
    if(MAX_FILE_SIZE_CAT === 'MB') {
        fileSize = parseFloat((file?.size / 1000 / 1024).toString());
    }

    if(fileSize > MAX_FILE_SIZE) return false

    return true
}

async function isFileImage(file:Express.Multer.File) {
    return new Promise((resolve, reject)=> {
        return readFile(file.path, async (error, buffer)=> {
            if(error) return reject(false);
            if(!buffer) return reject(false)

            return await validateBufferMIMEType(buffer, {
                allowMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf']
            }).then((result)=> {
                if(!result.ok) reject(false);
                else resolve(true)
            })
            .catch((error)=> {
                console.log(error)
                reject(false)
            });
        })
    })
}