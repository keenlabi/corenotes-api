import { emailExists, isEmailValid } from "../../../utils/authUtils/validator/emailValidator"
import { registerStaffRequestBodyType, validateRegisterStaffRequestBodyType } from "./types";

export default function validateRegisterStaffRequestBody (data:registerStaffRequestBodyType) {
    return new Promise<validateRegisterStaffRequestBodyType>(async (resolve, reject)=> {

        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ status: false, code: 422, message:'Input field cannot be empty' })

        if(!data.firstname) reject({ status: false, code: 422,  message:'Firstname field cannot be empty' });
        if(!data.lastname) reject({ status: false, code: 422,  message:'Lastname field cannot be empty' });
        if(!data.nickname) reject({ status: false, code: 422,  message:'Nickname field cannot be empty' });
        if(!data.initials) reject({ status: false, code: 422,  message:'Initials field cannot be empty' });
        if(!data.dob) reject({ status: false, code: 422,  message:'dob field cannot be empty' });
        if(!data.gender) reject({ status: false, code: 422,  message:'Initials field cannot be empty' });
        if(!data.address) reject({ status: false, code: 422,  message:'Initials field cannot be empty' });
        if(!data.city) reject({ status: false, code: 422,  message:'Initials field cannot be empty' });
        if(!data.state) reject({ status: false, code: 422,  message:'Initials field cannot be empty' });
        if(!data.zipCode) reject({ status: false, code: 422,  message:'Initials field cannot be empty' });

        // check if phone number is registered and return error if true
        if(!data.phoneNumber.work) reject({ status: false, code: 422,  message:'Work phone number field cannot be empty' });
        if(!data.phoneNumber.cell) reject({ status: false, code: 422,  message:'Cell phone number field cannot be empty' });

        if(!data.emergencyContact.name) reject({ status: false, code: 422,  message:'Emergency contact\'s number field cannot be empty' });
        if(!data.emergencyContact.relationship) reject({ status: false, code: 422,  message:'Emergency contact\'s relationship field cannot be empty' });
        if(!data.emergencyContact.phoneNumber) reject({ status: false, code: 422,  message:'Emergency contact\'s phone number field cannot be empty' });

        // check if email is registered already and return error if true
        if(!data.email) reject({ status: false, code: 422,  message:'Email field cannot be empty' });
        if(!isEmailValid(data.email)) reject({ status:false, code: 422, message:'Email is invalid' });
        if(await emailExists(data.email)) reject({ status:false, code: 409, message:'Email has been registered by another user' });

        if(!data.username) reject({ status: false, code: 422,  message:'Username field cannot be empty' });

        // check if password field is empty, check if password is at least characters long
        if(!data.password) reject({status:false, code:422, message: 'Password field cannot be empty'});
        // if(data.password !== String) reject({status:false, code:422, message: 'Password has to be string'});
        if(data.password?.length < 8) reject({status:false, code:422, message:'Password has to be 8 characters and more'});

        if(!data.compartment) reject({ status: false, code: 422,  message:'Compartment field cannot be empty' });
        if(!data.title) reject({ status: false, code: 422,  message:'Staff title field cannot be empty' });
        if(!data.providerRole) reject({ status: false, code: 422,  message:'Staff provider role field cannot be empty' });
        if(!data.hiredAt) reject({ status: false, code: 422,  message:'Hire date field cannot be empty' });
        if(!data.employeeId) reject({ status: false, code: 422,  message:'Employee id field cannot be empty' });
        if(!data.jobSchedule) reject({ status: false, code: 422,  message:'Job schedule type field cannot be empty' });

        // return success if true
        resolve({ status:true, code:200, message: 'SUCCESS', requestBody: data });
    })
}