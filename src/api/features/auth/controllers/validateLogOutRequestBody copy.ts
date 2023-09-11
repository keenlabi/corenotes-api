import { logOutRequestBodyType, validateLogOutRequestBodyType } from "./types";

export default function validateLogOutRequestBody(data:logOutRequestBodyType) {
    return new Promise<validateLogOutRequestBodyType>(async (resolve, reject)=> {

        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ status: false, code: 422, message:'Input field cannot be empty' })
        
        // check if email is registered already and return error if true
        if(!data.latitude ) reject({ status: false, code: 422,  message:'latitude field cannot be empty' });

        // check if password field is empty, check if password is at least characters long
        if(!data.longitude) reject({status:false, code:422, message: 'longitude field cannot be empty'});

        // return success if true
        resolve({ status:true, code:200, message: 'SUCCESS', requestBody: data });
    })
}