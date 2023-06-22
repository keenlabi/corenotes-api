import { Request, Response } from "express"
import UserModel from "../models/user.model";
import { sendFailureResponse, sendSuccessResponse } from "src/api/shared/globals/server/serverResponse";

export default function fetchProfile (req:Request, res:Response) {
    
    const query = { _id: req.params.userId || req.currentUser.id };

    UserModel.findOne(query)
    .then((foundUser)=> {
        if(!foundUser) return sendFailureResponse({res, statusCode: 404, message: "User profile doesn't exist"});
        foundUser.password = undefined;
        sendSuccessResponse({
            res, 
            statusCode: 200, 
            message: "User retrieved successfully", 
            data: { user: foundUser } 
        });
    })
    .catch((error)=> {
        console.log(error);
        sendFailureResponse({res, statusCode: 401, message: "Error retrieving user"});
    });
}