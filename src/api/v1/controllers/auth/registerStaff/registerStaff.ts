import { Request, Response } from "express"
import validateRegisterRequestBody from "./validateRegisterStaffRequestBody"
import { hashPassword } from "v1/utils/authUtils/security/password"
import { UserModel } from "v1/models"
import { sendFailureResponse, sendSuccessResponse } from "v1/utils/serverUtils/response"

export default function registerStaff(req:Request, res:Response) {
    validateRegisterRequestBody(req.body)
    .then(({ requestBody })=> {
        // encrypt user password
        hashPassword(requestBody.password)
        .then((hashedPassword)=> {
            UserModel.create({
                email: requestBody.email,
                firstname: requestBody.firstname,
                lastname: requestBody.lastname,
                username: requestBody.username,
                password: hashedPassword,
                phoneNumber: requestBody.phoneNumber,
                role:'STAFF'
            })
            .then((createdUser)=> {
                console.log(`REGISTRATION: New staff registered successfully`)
                sendSuccessResponse(res, 201, "New staff registered successfully", {})
            })
            .catch((error)=> {
                console.log(`User is attempting to register with existing phone number :`, error);
                sendFailureResponse(res, 422, "Phone number has been registered by another user.");
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