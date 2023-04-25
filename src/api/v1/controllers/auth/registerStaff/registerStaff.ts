import { Request, Response } from "express"
import validateRegisterRequestBody from "./validateRegisterStaffRequestBody"
import { hashPassword } from "v1/utils/authUtils/password"
import { UserModel } from "v1/models"
import { sendFailureResponse, sendSuccessResponse } from "v1/utils/serverUtils/response"

export default function registerStaff(req:Request, res:Response) {
    validateRegisterRequestBody(req.body)
    .then(({ requestBody })=> {
        // encrypt user password
        hashPassword(requestBody.password)
        .then((hashedPassword)=> {
            
        })
        .catch((error)=> {
            console.log('There was an error hashing user password\n', error);
            sendFailureResponse(res, 422, 'There was a server error, not your fault, try again');
        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        console.log(`VALIDATION ERROR: There was an error validating request body`)
        console.log(error)
        sendFailureResponse(res, error.code, error.message);
    })
}