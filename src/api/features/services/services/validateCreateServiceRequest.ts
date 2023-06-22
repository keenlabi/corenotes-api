import getServiceByTitle from "./db/getServiceByTitle";
import { ICreateServiceRequestBody } from "./types";

export default function validateCreateServiceRequest(data:ICreateServiceRequestBody) {
    return new Promise<ICreateServiceRequestBody>((resolve, reject)=> {
        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ code: 422, message:'Input fields cannot be empty' })

        if(!data.title) reject({ code: 422, message:'Service title field cannot be empty' })
        getServiceByTitle(data.title)
        .then((foundService)=> {
            if(foundService) reject({ code: 409, message:'Service title already exist' })
        })
        .catch((error)=> {
            console.log("SERVICES ERROR: There was a server error validating create service request")
            console.log(error)
            reject({ code: 500, message:"There was a server error validating create service request, try again." })
        })

        const newData = { ...data, title: data.title.toLocaleLowerCase() }

        // return success if true
        resolve(newData);
    })
}