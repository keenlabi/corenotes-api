import { Request, Response } from "express"
import validateLoginRequestBody from "./validateLoginRequestBody";
import { UserModel } from "../../../models";
import { sendFailureResponse, sendSuccessResponse } from "../../../utils/serverUtils/response";
import { verifyPassword } from "../../../utils/authUtils/security/password";
import generateToken from "../../../utils/authUtils/security/token/generateAccessToken";
import storeAuthToken from "../../../utils/authUtils/security/token/storeAccessToken";
import { IUser } from "../../../models/UserModel/types";

export default async function logIn(req:Request, res:Response) {

    validateLoginRequestBody(req.body)
    .then(({ requestBody })=> {
        let query:any = { username: requestBody.username };

        UserModel.findOne(query)
        .then((foundUser)=> {
            if(!foundUser) sendFailureResponse(res, 401, 'Oops! The username or password entered does not match our record. Please confirm and try again.');
            else verifyPassword(requestBody.password, foundUser.password)
                .then((isVerified)=> {
                    if(!isVerified) return sendFailureResponse(res, 401, 'Oops! The username or password entered does not match our record. Please confirm and try again.');

                    generateToken(foundUser.id, res)
                    .then((authToken:string)=> {
                        storeAuthToken(foundUser.id, authToken)
                        .then((authenticatedUser:IUser)=> {
                            console.log(`LOGIN: User login in `, {
                                id: foundUser.id,
                                dateTime: new Date().toLocaleString()
                            });

                            const newAuthUser:any = { ...authenticatedUser }
                            delete newAuthUser._doc.password
                            delete newAuthUser._doc.accessToken

                            return sendSuccessResponse(res, 200, "User signed in successfully", { user: newAuthUser._doc });
                        })
                        .catch((error)=> {
                            console.log(`AUTHENTICATION ERROR: There was an error generating authentication token, try logging in`);
                            console.log(error)
                            sendFailureResponse(res, 422, "There was an error verifing credentials");
                        })
                    })
                    .catch((error)=> {
                        console.log(`AUTHENTICATION ERROR: There was an error generating authentication token, try logging in`);
                        console.log(error)
                        sendFailureResponse(res, 422, "There was an error verifing credentials");
                    })
                    
                })
                .catch((error)=> {
                    console.log(`AUTHENTICATION ERROR: There was an error verifying password, try to log in`);
                    console.log(error)
                    sendFailureResponse(res, 422, "There was an error verifing credentials");
                })
        })
        .catch((error)=> {
            console.log('There was an error finding user for sign in', error);
            sendFailureResponse(res, 500, error.message);
        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        console.log(`VALIDATION ERROR: There was an error validating login request body`)
        console.log(error)
        sendFailureResponse(res, error.code, error.message)
    })
}