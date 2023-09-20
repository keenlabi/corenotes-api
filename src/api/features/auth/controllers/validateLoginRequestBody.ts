import { ILoginRequestBodyType, validateLoginRequestBodyType } from "./types";

export default function validateLoginRequestBody(data:ILoginRequestBodyType) {
    return new Promise<validateLoginRequestBodyType>(async (resolve, reject)=> {

        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ status: false, code: 422, message:'Input field cannot be empty' })
        
        // check if email is registered already and return error if true
        if(!data.username ) reject({ status: false, code: 422,  message:'Username field cannot be empty' });

        // check if password field is empty, check if password is at least characters long
        if(!data.password) reject({status:false, code:422, message: 'Password field cannot be empty'});

        // return success if true
        resolve({ status:true, code:200, message: 'SUCCESS', requestBody: data });
    })
}