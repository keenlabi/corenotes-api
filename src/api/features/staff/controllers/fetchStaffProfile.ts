import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { Request, Response } from "express"
import UserModel from "@user/models/user.model"

export default function fetchStaffProfile(req:Request, res:Response) {

    const query = { _id: req.params.staffId }
    
    UserModel
    .findOne(query)
    .lean()
    .then((foundStaff:any)=> {
        
        const { password, accessToken, createdAt, ...filteredFoundStaff } = foundStaff  

        return sendSuccessResponse({res, statusCode: 200, message: "Staff profile retrieved successfully", data: { 
            staff: filteredFoundStaff
        }})
    })
    .catch(()=> {
        return sendFailureResponse({res, statusCode:200, message:"There was an error fetching staff profile"})
    })
}