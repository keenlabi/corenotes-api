import { Request, Response } from "express";
import { ServerError, ValidationError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import insertStaffRoleToDB from "@staff/services/db/insertStaffRoleToDB";
import fetchAllStaffRoles from "@staff/services/fetchAllStaffRoles";
import validateCreateStaffRoleRequest from "@staff/services/validateCreateStaffRoleRequest";

export default function createStaffRole(req:Request, res:Response) {
    validateCreateStaffRoleRequest({...req.body})
    .then((requestBody)=> {
        insertStaffRoleToDB(requestBody)
        .then(()=> {
            fetchAllStaffRoles(1)
            .then((staffRolesForClient)=> {
                return sendSuccessResponse({ 
                    res, 
                    statusCode: 201, 
                    message: "New staff role created successfully",
                    data: staffRolesForClient
                })
            })
            .catch((error)=> {
                console.log("There was an error fetching all staff roles ", error);

                const serverError = new ServerError();
                return sendFailureResponse({res, statusCode: serverError.statusCode, message: serverError.message})
            })
        })
    })
    .catch((error)=> {
        if(error?.code === 422) {
            const validationError =  new ValidationError(error.message)
            return sendFailureResponse({ res, statusCode: validationError.statusCode, message: validationError.message })
        }

        const serverError =  new ServerError()
        return sendFailureResponse({ res, statusCode: serverError.statusCode, message: serverError.message })
    })  
}