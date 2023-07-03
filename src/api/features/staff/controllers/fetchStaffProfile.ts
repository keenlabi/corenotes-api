import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { Request, Response } from "express"
import UserModel from "@user/models/user.model"
import { getStaffRoleById } from "@services/db/staff.service"

export default function fetchStaffProfile(req:Request, res:Response) {

    const query = { _id: req.params.staffId }
    
    UserModel.findOne(query)
    .then(async (foundStaff)=> {
        const role = (await getStaffRoleById(foundStaff.providerRole)).title
        foundStaff.providerRole = role;
        
        const { password, accessToken, createdAt, ...filteredFoundStaff } = foundStaff._doc

        return sendSuccessResponse({res, statusCode: 200, message: "Staff profile retrieved successfully", data: { 
            staff: filteredFoundStaff
        }})
    })
    .catch(()=> {
        return sendFailureResponse({res, statusCode:200, message:"There was an error fetching staff profile"})
    })
}