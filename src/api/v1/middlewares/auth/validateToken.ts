import { NextFunction, Request, Response } from "express";
import { verify, sign } from "jsonwebtoken";
import { UserModel } from "../../models";
import { sendFailureResponse } from "../../utils/serverUtils/response";

export default function validateToken (req:Request, res:Response, next:NextFunction) {
    return new Promise((reject)=> {
        let token = req.headers.cookie;

        if(token && token.includes('sid')) {
            const allCookies = token.toString().split(';');
            const tokenCookie = allCookies.filter(cookie => cookie.includes('sid'));
            token = tokenCookie[0].split('=')[1];
            
            verify(token, process.env.JWT_KEY!, (error:any, decodedToken:any)=> {
                if(error) return sendFailureResponse(res, 401, 'Unauthorized');

                const query = {
                    _id: decodedToken.id ,accessToken: token 
                };

                UserModel.findOne(query)
                .then((foundUser)=> {
                    if(!foundUser) {
                        console.log(foundUser)
                        return sendFailureResponse(res, 401, 'Unauthorized');
                    }

                    req.userId = decodedToken.id;
                    next();
                })
            })
    
        } else {
            console.log(token)
            reject(sendFailureResponse(res, 401, 'Unauthorized'));
        }
    });
}