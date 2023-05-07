import { unlink  } from "fs"

export default function deleteLocalFiles (filePath:string) {
    return new Promise<void>((resolve, reject)=> {
        unlink(filePath, (error)=> {
            if(error) reject(error);
            return resolve();
        })
    })
}