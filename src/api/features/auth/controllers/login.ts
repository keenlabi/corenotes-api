import { Request, Response } from "express"
import validateLoginRequestBody from "./validateLoginRequestBody";
import { verifyPassword } from "@services/security/password";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import generateAuthToken from "@services/security/token/generateAccessToken";
import storeAuthToken from "@services/security/token/storeAccessToken";
import { getStaffUserByUsername, updateStaffLastSeenById } from "@services/db/staff.service";
import getUserByObjectId from "@services/db/user.service";

export default async function logIn(req:Request, res:Response) {

    validateLoginRequestBody(req.body)
    .then(({ requestBody })=> {

        getStaffUserByUsername(requestBody.username)
        .then((foundStaff)=> {
            if(!foundStaff) return sendFailureResponse({res, statusCode: 401, message: 'Oops! The username or password entered does not match our record. Please confirm and try again.'});
            
            verifyPassword(requestBody.password, foundStaff.password!)
            .then(async (isVerified)=> {
                if(!isVerified) return sendFailureResponse({res, statusCode: 401, message: 'Oops! The username or password entered does not match our record. Please confirm and try again.'});

                generateAuthToken(foundStaff.id, res)
                .then((authToken)=> {
                    storeAuthToken(foundStaff.id, authToken)
                    .then((authenticatedUser)=> {
                        return sendSuccessResponse({res, statusCode: 200, message: "Staff User signed in successfully", data: { user: authenticatedUser } });
                    })
                    .catch((error)=> {
                        console.log(`AUTHENTICATION ERROR: There was an error generating authentication token, try logging in`);
                        console.log(error)
                        sendFailureResponse({res, statusCode: 422, message:"There was an error verifing credentials"});
                    })
                })
                .catch((error)=> {
                    console.log(`AUTHENTICATION ERROR: There was an error generating authentication token, try logging in`);
                    console.log(error)
                    sendFailureResponse({res, statusCode: 422, message:"There was an error verifing credentials"});
                }) 
            })
            .catch((error)=> {
                console.log(`AUTHENTICATION ERROR: There was an error verifying password, try to log in`);
                console.log(error)
                sendFailureResponse({res, statusCode: 422, message:"There was an error verifing credentials"});
            })
        })
        .catch((error)=> {
            console.log('There was an error finding user for sign in', error);
            sendFailureResponse({res, statusCode: 500, message:error.message});
        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        console.log(`VALIDATION ERROR: There was an error validating login request body`)
        console.log(error)
        sendFailureResponse({res, statusCode: error.code, message: error.message});
    })
}