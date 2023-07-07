import { ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import getStaffRoleDetailsById from "@staff/services/getStaffRoleDetailsById";
import { Request, Response } from "express";

export default function fetchStaffRolesDetails(req:Request, res:Response) {
    console.log(req.params.roleId)
    getStaffRoleDetailsById(req.params.roleId)
    .then((response)=> {
        console.log(response)
        return sendSuccessResponse({ 
            res, 
            statusCode: 200, 
            message: "Staff role details retrieved successfully",
            data: { staffRoleDetails: response } 
        })
    })
    .catch((error)=> {
        console.log("There was an error fetching staff role")
        console.log(error)
        
        const serverError =  new ServerError()
        return sendFailureResponse({ res, statusCode: serverError.statusCode, message: serverError.message })
    })
}