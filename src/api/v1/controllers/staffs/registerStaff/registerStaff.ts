import { Request, Response } from "express"
import validateRegisterRequestBody from "./validateRegisterStaffRequestBody"
import { hashPassword } from "v1/utils/authUtils/security/password"
import { UserModel } from "v1/models"
import { sendFailureResponse, sendSuccessResponse } from "v1/utils/serverUtils/response"
import fetchStaffs from "../fetchStaffs"

export default function registerStaff(req:Request, res:Response) {

    validateRegisterRequestBody(req.body)
    .then(({ requestBody })=> {
        
        // encrypt user password
        hashPassword(requestBody.password)
        .then((hashedPassword)=> {
            UserModel.create({
                firstname: requestBody.firstname,
                lastname: requestBody.lastname,
                nickname: requestBody.nickname,
                initials: requestBody.initials,
                dob: requestBody.dob,
                gender: requestBody.gender,
                address: requestBody.address,
                city: requestBody.city,
                state: requestBody.state,
                zipCode: requestBody.zipCode,
                phoneNumber: {
                    work: requestBody.phoneNumber.work,
                    cell: requestBody.phoneNumber.cell,
                    other: requestBody.phoneNumber.other
                },
                emergencyContact: {
                    name: requestBody.emergencyContact.name,
                    relationship: requestBody.emergencyContact.relationship,
                    phoneNumber: requestBody.emergencyContact.phoneNumber
                },
                email: requestBody.email,
                
                // WORK INFORMATION
                compartment: requestBody.compartment,
                title: requestBody.title,
                providerRole: requestBody.providerRole,
                hiredAt: requestBody.hiredAt,
                username: requestBody.username,
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
                sendFailureResponse(res, 422, "There was an error creating new staff");
            });
        })
        .catch((error)=> {
            console.log('There was an error hashing user password\n', error);
            sendFailureResponse(res, 422, 'There was a server error, not your fault, try again');
        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        console.log(`VALIDATION ERROR: There was an error validating register staff request body`)
        console.log(error)
        sendFailureResponse(res, error.code, error.message);
    })
}