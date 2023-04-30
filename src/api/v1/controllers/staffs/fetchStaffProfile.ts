import { Request, Response } from "express"
import { UserModel } from "v1/models";
import { IUser } from "v1/models/UserModel/types";
import { sendFailureResponse, sendSuccessResponse } from "v1/utils/serverUtils/response";

export default function fetchStaffProfile(req:Request, res:Response) {

    const query = { _id: req.params.staffId }
    
    UserModel.findOne(query)
    .then((foundStaff:IUser)=> {
        return sendSuccessResponse(res, 200, "Staff profile retrieved successfully", { 
            staff: foundStaff
        })
    })
    .catch(()=> {
        return sendFailureResponse(res, 200, "There was an error fetching staff profile")
    })
}