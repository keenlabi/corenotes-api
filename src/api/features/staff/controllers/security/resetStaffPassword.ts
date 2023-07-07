import { Request, Response } from "express"
import UserModel from "@user/models/user.model"
import { hashPassword } from "@services/security/password";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import updateStaffPassword from "@staff/services/updateStaffPassword";
import { IStaffDocument } from "@staff/model/types";
import { ServerError } from "@globals/server/Error";

export default function resetStaffPassword(req:Request, res:Response) {

    const newPassword = req.body.newPassword;

    hashPassword(newPassword)
    .then((hashedPassword)=> {
        updateStaffPassword(parseInt(req.params.staffId), hashedPassword)
        .then(()=> {

            return sendSuccessResponse({
                res, 
                statusCode: 200,
                message: "Staff user has been updated successfully"
            })
        })
        .catch((error)=> {
            console.log(error)
            const serverError = new ServerError();
            return sendFailureResponse({ 
                res, 
                statusCode: serverError.statusCode,
                message: serverError.message
            })
        })
    })
    .catch((error)=> {
        console.log(error)
        const serverError = new ServerError();
        return sendFailureResponse({ 
            res, 
            statusCode: serverError.statusCode,
            message: serverError.message
        })
    })
}