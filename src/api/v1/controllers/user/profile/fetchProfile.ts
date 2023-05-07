import { Request, Response } from "express"
import { UserModel } from "../../../models";
import { sendFailureResponse, sendSuccessResponse } from "api/v1/utils/serverUtils/response";

export default function fetchProfile (req:Request, res:Response) {
    
    const query = { _id: req.params.userId || req.userId };

    UserModel.findOne(query)
    .then((foundUser)=> {
        if(!foundUser) return sendFailureResponse(res, 404, "User profile doesn't exist");
        foundUser.password = undefined;
        sendSuccessResponse(res, 200, "User retrieved successfully", {user: foundUser});
    })
    .catch((error)=> {
        console.log(error);
        sendFailureResponse(res, 401, "Error retrieving user");
    });
}