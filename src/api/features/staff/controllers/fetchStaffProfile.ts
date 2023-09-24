import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { Request, Response } from "express"
import { getStaffRoleById, getStaffUserByStaffId } from "src/api/shared/services/db/staff.service"

export default function fetchStaffProfile(req:Request, res:Response) {

    getStaffUserByStaffId(parseInt(req.params.staffId))
    .then(async (foundStaff)=> {
        foundStaff.providerRole = (await getStaffRoleById(foundStaff.providerRole)).title;

        return sendSuccessResponse({
            res, 
            statusCode: 200, 
            message: "Staff profile retrieved successfully", 
            data: { staff: foundStaff }
        })
    })
    .catch(()=> {
        return sendFailureResponse({
            res,
            statusCode:200, 
            message:"There was an error fetching staff profile"
        })
    })
}