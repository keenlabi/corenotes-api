import { emailExists, isEmailValid } from "v1/utils/authUtils/validator/emailValidator"
import { phoneExists } from "v1/utils/authUtils/validator/phoneNumberValidator";
import { registerStaffRequestBodyType, validateRegisterStaffRequestBodyType } from "./types";

export default function validateRegisterStaffRequestBody (data:registerStaffRequestBodyType) {
    return new Promise<validateRegisterStaffRequestBodyType>(async (resolve, reject)=> {

        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ status: false, code: 422, message:'Input field cannot be empty' })

        if(!data.firstname) reject({ status: false, code: 422,  message:'Firstname field cannot be empty' });
        if(!data.lastname) reject({ status: false, code: 422,  message:'Firstname field cannot be empty' });

        // check if email is registered already and return error if true
        if(!data.email) reject({ status: false, code: 422,  message:'Email field cannot be empty' });
        if(!isEmailValid(data.email)) reject({ status:false, code: 422, message:'Email is invalid' });
        if(await emailExists(data.email)) reject({ status:false, code: 409, message:'Email has been registered by another user' });

        if(!data.username) reject({ status: false, code: 422,  message:'Username field cannot be empty' });

        // check if phone number is registered and return error if true
        if(!data.phoneNumber) reject({ status: false, code: 422,  message:'Phone number field cannot be empty' });
        // if(data.phoneNumber?.toString().length !== 13) reject({ status:false, code:422, message:'Phone number is not valid' });
        if(await phoneExists(data.phoneNumber)) reject({ status: false, code: 422,  message:'Phone number has previously been registered' });

        // check if password field is empty, check if password is at least characters long
        if(!data.password) reject({status:false, code:422, message: 'Password field cannot be empty'});
        // if(data.password !== String) reject({status:false, code:422, message: 'Password has to be string'});
        if(data.password?.length < 8) reject({status:false, code:422, message:'Password has to be 8 characters and more'});


        // return success if true
        resolve({ status:true, code:200, message: 'SUCCESS', requestBody: data });
    })
}