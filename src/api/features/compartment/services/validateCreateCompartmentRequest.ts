import { RequestFileType } from "@globals/middlewares/uploadFile"

export interface ICreateCompRequestBody {
    title:string,
    image:RequestFileType,
    staffRoles:Array<string>,
    assignedIndividuals:Array<string>
}

export default function validateCreateCompartmentRequest(data:ICreateCompRequestBody) {
    return new Promise<ICreateCompRequestBody>((resolve, reject)=> {
        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ code: 422, message:'Input fields cannot be empty' })

        if(!data.title) reject({ code: 422, message:'Compartment title field cannot be empty' })
        if(!data.image) reject({ code: 422, message:'Compartment image field cannot be empty' })

        // return success if true
        resolve(data);
    })
}