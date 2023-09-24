import { Request, Response } from "express";
import fetchAllStaffRoles from "../../services/roles/fetchAllStaffRoles";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";

export default function fetchStaffRoles(req:Request, res:Response) {
    fetchAllStaffRoles(parseInt(req.params.pageNumber))
    .then((responseData)=> {
        return sendSuccessResponse({ 
            res, 
            statusCode: 200, 
            message: "Staff roles retrieved successfully", 
            data: responseData 
        })
    })
    .catch((error)=> {
        
        console.log("There was an error fetching all staff roles ", error);

        const serverError = new ServerError();
        return sendFailureResponse({res, statusCode: serverError.statusCode, message: serverError.message})
    })
}