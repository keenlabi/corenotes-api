import { Request, Response } from "express"
import validateRegisterRequestBody from "./validateRegisterStaffRequestBody"
import { hashPassword } from "../../../../shared/services/security/password"
import UserModel from "../../../user/models/user.model"
import { sendFailureResponse } from "../../../../shared/globals/server/serverResponse"
import fetchStaffs from "../fetchStaffs"

export default function register(req:Request, res:Response) {
    validateRegisterRequestBody(req.body)
    .then(({ requestBody })=> {
        
        // encrypt user password
        hashPassword(requestBody.password)
        .then((hashedPassword)=> {
            UserModel.create({
                firstname: requestBody.firstname.toLowerCase(),
                lastname: requestBody.lastname.toLowerCase(),
                nickname: requestBody.nickname.toLowerCase(),
                initials: requestBody.initials.toLowerCase(),
                dob: requestBody.dob,
                gender: requestBody.gender.toLowerCase(),
                address: requestBody.address,
                city: requestBody.city.toLowerCase(),
                state: requestBody.state.toLowerCase(),
                zipCode: requestBody.zipCode,
                phoneNumber: {
                    work: requestBody.phoneNumber.work,
                    cell: requestBody.phoneNumber.cell,
                    other: requestBody.phoneNumber.other
                },
                emergencyContact: {
                    name: requestBody.emergencyContact.name.toLowerCase(),
                    relationship: requestBody.emergencyContact.relationship.toLowerCase(),
                    phoneNumber: requestBody.emergencyContact.phoneNumber
                },
                email: requestBody.email.toLowerCase(),
                
                // WORK INFORMATION
                title: requestBody.title.toLowerCase(),
                providerRole: requestBody.providerRole,
                hiredAt: requestBody.hiredAt,
                username: requestBody.username.toLowerCase(),
                employeeId: requestBody.employeeId,
                jobSchedule: requestBody.jobSchedule,
                password: hashedPassword,
                role:'STAFF'
            })
            .then(()=> {
                console.log(`REGISTRATION: New staff registered successfully`)
                fetchStaffs(req, res)
                // sendSuccessResponse(res, 201, "New staff registered successfully", {})
            })
            .catch((error)=> {
                console.log(`There was an error creating new staff: `, error);
                sendFailureResponse({res, statusCode: 422, message: "There was an error creating new staff"});
            });
        })
        .catch((error)=> {
            console.log('There was an error hashing user password\n', error);
            sendFailureResponse({res, statusCode: 422, message: 'There was a server error, not your fault, try again'});
        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        console.log(`VALIDATION ERROR: There was an error validating register staff request body`)
        console.log(error)
        sendFailureResponse({res, statusCode: error.code, message: error.message});
    })
}