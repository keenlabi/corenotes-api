import { Request, Response } from "express"
import { UserModel } from "api/v1/models";
import { IUser } from "api/v1/models/UserModel/types";
import { sendFailureResponse, sendSuccessResponse } from "api/v1/utils/serverUtils/response";

export default function fetchStaffProfile(req:Request, res:Response) {

    const query = { _id: req.params.staffId }
    
    UserModel
    .findOne(query)
    .lean()
    .then((foundStaff:any)=> {
        
        const { password, accessToken, createdAt, ...filteredFoundStaff } = foundStaff  

        return sendSuccessResponse(res, 200, "Staff profile retrieved successfully", { 
            staff: filteredFoundStaff
        })
    })
    .catch(()=> {
        return sendFailureResponse(res, 200, "There was an error fetching staff profile")
    })
}