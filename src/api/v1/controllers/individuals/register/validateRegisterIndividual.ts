import { emailExists, isEmailValid } from "../../../utils/authUtils/validator/emailValidator";
import { registerIndividualRequestBodyType, validateRegisterIndividualRequestBodyType } from "./types";

export default function validateRegisterIndividual(data:registerIndividualRequestBodyType) {
    return new Promise<validateRegisterIndividualRequestBodyType>(async (resolve, reject)=> {

        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ status: false, code: 422, message:'Input field cannot be empty' })

        if(!data.firstname) reject({ status: false, code: 422,  message:'Firstname field cannot be empty' });
        if(!data.lastname) reject({ status: false, code: 422,  message:'Lastname field cannot be empty' });
        if(!data.dob) reject({ status: false, code: 422,  message:'Date of birth field cannot be empty' });
        if(!data.gender) reject({ status: false, code: 422,  message:'Gender field cannot be empty' });

        if(!data.ssn) reject({ status: false, code: 422,  message:'SSN field cannot be empty' });
        if(!data.contact.name) reject({ status: false, code: 422,  message:'Contact name field cannot be empty' });
        
        // check if email is registered already and return error if true
        if(!data.contact.email) reject({ status: false, code: 422,  message:'Email field cannot be empty' });
        if(!isEmailValid(data.contact.email)) reject({ status:false, code: 422, message:'Email is invalid' });
        
        if(!data.contact.phoneNumber) reject({ status: false, code: 422,  message:'Contact phone number field cannot be empty' });

        if(!data.weight) reject({ status: false, code: 422,  message:'Weight field cannot be empty' });
        if(!data.medicaidNumber) reject({ status: false, code: 422,  message:'Medicaid number field cannot be empty' });
        if(!data.maritalStatus) reject({ status: false, code: 422,  message:'Marital status field cannot be empty' });
        
        if(!data.codeAlert.length) reject({ status: false, code: 422,  message:'Code alert field cannot be empty' });

        if(!data.requestedServices.length) reject({ status: false, code: 422,  message:'Requested services field cannot be empty' });
        
        if(!data.diet) reject({ status: false, code: 422,  message:'Diet field cannot be empty' });

        if(!data.allergies.food) reject({ status: false, code: 422,  message:'Food allergies field cannot be empty' });

        if(!data.allergies.med) reject({ status: false, code: 422,  message:'Med allergies field cannot be empty' });

        if(!data.allergies.other) reject({ status: false, code: 422,  message:'Other allergies field cannot be empty' });

        // return success if true
        resolve({ status:true, code:200, message: 'SUCCESS', requestBody: data });
    })
}