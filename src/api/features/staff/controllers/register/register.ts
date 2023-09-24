import { Request, Response } from "express"
import validateRegisterRequestBody from "./validateRegisterStaffRequestBody"
import { hashPassword } from "../../../../shared/services/security/password"
import { sendFailureResponse, sendSuccessResponse } from "../../../../shared/globals/server/serverResponse"
import staffModel from "@staff/model/staff.model"
import { ConflictError, ServerError } from "@globals/server/Error"
import { getStaffUserByUsername } from "src/api/shared/services/db/staff.service"
import mongoose from "mongoose"
import fetchAllStaffs from "@staff/services/fetchAllStaffs"

export default function register(req:Request, res:Response) {
    validateRegisterRequestBody(req.body)
    .then(({ requestBody })=> {
        
        // encrypt user password
        hashPassword(requestBody.password)
        .then(async (hashedPassword)=> {

            const foundStaff = await getStaffUserByUsername(requestBody.username);
            if(foundStaff) {
                const conflictError = new ConflictError("Staff username already exists, please choose another username")
                return sendFailureResponse({ res, statusCode: conflictError.statusCode, message: conflictError.message })
            }

            const newUserObjectId = new mongoose.Types.ObjectId();
            const newEmployeeId = "1234567";

            staffModel.create({
                _id: new mongoose.Types.ObjectId(),
                user: newUserObjectId,
                firstname: requestBody.firstname.toLowerCase(),
                lastname: requestBody.lastname.toLowerCase(),
                nickname: requestBody.nickname?.toLowerCase(),
                initials: requestBody.initials.toLowerCase(),
                dob: requestBody.dob,
                gender: requestBody.gender.toLowerCase(),
                address: requestBody.address,
                city: requestBody.city.toLowerCase(),
                state: requestBody.state.toLowerCase(),
                zipCode: requestBody.zipCode,
                phoneNumber: {
                    work: requestBody.phoneNumber.work,
                    cell: requestBody.phoneNumber.cell
                },
                emergencyContact: {
                    name: requestBody.emergencyContact.name.toLowerCase(),
                    relationship: requestBody.emergencyContact.relationship.toLowerCase(),
                    phoneNumber: requestBody.emergencyContact.phoneNumber
                },
                email: requestBody.email.toLowerCase(),
                
                // WORK INFORMATION
                providerRole: requestBody.providerRole,
                hiredAt: requestBody.hiredAt,
                username: requestBody.username.toLowerCase(),
                employeeId: newEmployeeId,
                jobSchedule: requestBody.jobSchedule,
                password: hashedPassword,
                role:'STAFF'
            })
            .then(()=> {

                console.log(`REGISTRATION: New staff registered successfully`)
                
                fetchAllStaffs(1)
                .then((fetchStaffResponse)=> {
                    return sendSuccessResponse({ res, statusCode:201, message:"Staff registered successfully", data:fetchStaffResponse })
                })
                .catch((error)=> {
                    console.log("There was an error fetching all staffs list", error);
                    const serverError = new ServerError();
                    return sendFailureResponse({ res, statusCode: serverError.statusCode, message: serverError.message });
                })
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