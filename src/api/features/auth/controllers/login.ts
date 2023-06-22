import { Request, Response } from "express"
import validateLoginRequestBody from "./validateLoginRequestBody";
import UserModel from "../../user/models/user.model";
import { verifyPassword } from "@services/security/password";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import generateAuthToken from "@services/security/token/generateAccessToken";
import storeAuthToken from "@services/security/token/storeAccessToken";
import { IUser } from "@user/models/types";

export default async function logIn(req:Request, res:Response) {

    validateLoginRequestBody(req.body)
    .then(({ requestBody })=> {
        let query:any = { username: requestBody.username };

        UserModel.findOne(query)
        .then((foundUser)=> {
            if(!foundUser) sendFailureResponse({res, statusCode: 401, message: 'Oops! The username or password entered does not match our record. Please confirm and try again.'});
            else verifyPassword(requestBody.password, foundUser.password)
                .then((isVerified)=> {
                    if(!isVerified) return sendFailureResponse({res, statusCode: 401, message: 'Oops! The username or password entered does not match our record. Please confirm and try again.'});

                    generateAuthToken(foundUser.id, res)
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

                            return sendSuccessResponse({res, statusCode: 200, message: "User signed in successfully", data: { user: newAuthUser._doc } });
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