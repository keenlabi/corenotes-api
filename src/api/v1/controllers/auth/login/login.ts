import { Request, Response } from "express"
import validateLoginRequestBody from "./validateLoginRequestBody";
import { UserModel } from "v1/models";
import { sendFailureResponse } from "v1/utils/serverUtils/response";
import { verifyPassword } from "v1/utils/authUtils/password";

export default async function logIn(req:Request, res:Response) {

    validateLoginRequestBody(req.body)
    .then(({ requestBody })=> {
        let query:any = { email: requestBody.email };

        UserModel.findOne(query)
        .then((foundUser)=> {
            if(!foundUser) sendFailureResponse(res, 401, 'Oops! The email or password entered does not match our record. Please confirm and try again.');
            else verifyPassword(requestBody.password, foundUser.password)
                .then((isVerified)=> {
                    if(!isVerified) return sendFailureResponse(res, 401, 'Oops! The email or password entered does not match our record. Please confirm and try again.');

                    
                })
                .catch((error)=> {
                    console.log(`There was an error verifying password, try to log in`);
                    sendFailureResponse(res, 422, "Account has been created successfully. Couldn't authenticate user, try logging in.");
                })
        })
        .catch((error)=> {
            console.log('There was an error finding user for sign in', error);
            sendFailureResponse(res, 500, error.message);
        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        sendFailureResponse(res, error.code, error.message)
    })
}