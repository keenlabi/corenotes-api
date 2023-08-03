import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { sendFailureResponse } from "../server/serverResponse";
import { NotAuthorizedError } from "../server/Error";
import { getAuthUserByAuthAccessToken } from "../../services/db/auth.service";

export default function validateToken (req:Request, res:Response, next:NextFunction) {
    let token:string = req.headers.cookie!;

    if(!token || !token.includes('sid')) {
        const nonAuthorizedError = new NotAuthorizedError('Unauthorized')
        return sendFailureResponse({
            res, 
            statusCode: nonAuthorizedError.statusCode, 
            message: nonAuthorizedError.message
        });
    }

    const allCookies = token.toString().split(';');
    const tokenCookie = allCookies.filter(cookie => cookie.includes('sid'));
    token = tokenCookie[0].split('=')[1];

    
    verify(token, process.env.JWT_KEY!, (error:any, decodedToken:any)=> {
        if(error) {
            const unauthorizedError = new NotAuthorizedError('There was an error')
            return sendFailureResponse({ res, statusCode: unauthorizedError.statusCode, message: unauthorizedError.message });
        }

        getAuthUserByAuthAccessToken(decodedToken.id, token!)
        .then((foundUser)=> {
            if(!foundUser) {
                const nonAuthorizedError = new NotAuthorizedError('Unauthorized')
                return sendFailureResponse({
                    res, 
                    statusCode: nonAuthorizedError.statusCode, 
                    message: nonAuthorizedError.message
                });
            }
            
            req.currentUser = {
                id: foundUser.id,
                staffObjectId: foundUser.staffObjectId,
                staffId: foundUser.staffId,
                email: foundUser.email,
                firstname: foundUser.firstname
            }

            next();
        })
        .catch((error)=> {
            console.log(error)
            const nonAuthorizedError = new NotAuthorizedError('Unauthorized')
            return sendFailureResponse({
                res, 
                statusCode: nonAuthorizedError.statusCode, 
                message: nonAuthorizedError.message
            });
        })
    })
}