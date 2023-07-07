import { RequestFileType } from "@globals/middlewares/uploadFile"
import getCompartmentByTitle from "./db/getCompartmentByTitle"

export interface ICreateCompRequestBody {
    title:string,
    image:RequestFileType,
    staffRoles:Array<string>,
    // assignedIndividuals:Array<string>,
    // bgColor:string,
    // labelColor:string
}

export default function validateCreateCompartmentRequest(data:ICreateCompRequestBody) {
    return new Promise<ICreateCompRequestBody>((resolve, reject)=> {
        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ code: 422, message:'Input fields cannot be empty' })

        if(!data.title) reject({ code: 422, message:'Compartment title field cannot be empty' })
        
        getCompartmentByTitle(data.title)
        .then((foundCompartment)=> {
            if(foundCompartment) reject({ code: 422, message:'Compartment already exist, please choose another title' })
        })
        .catch(()=> reject({ code: 500, message:'Error validating this request, please try again' }))

        if(!data.image) reject({ code: 422, message:'Compartment image field cannot be empty' })

        const compartmentData:ICreateCompRequestBody = Object.freeze({
            title: data.title.toLowerCase(),
            image: data.image,
            staffRoles: data.staffRoles,
            // meta: {
            //     bgColor: data.bgColor,
            //     labelColor: data.labelColor
            // },
        })

        // return success if true
        resolve(compartmentData);
    })
}