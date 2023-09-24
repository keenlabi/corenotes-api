import { Request, Response } from "express";
import { ServerError, ValidationError } from "@globals/server/Error";
import { sendConflictFailureResponse, sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import insertStaffRoleToDB from "@staff/services/db/insertStaffRoleToDB";
import fetchAllStaffRoles from "@staff/services/roles/fetchAllStaffRoles";
import validateCreateStaffRoleRequest from "@staff/services/validateCreateStaffRoleRequest";
import { getStaffRoleByTitle } from "@services/db/staff.service";

export default function createStaffRole(req:Request, res:Response) {
    validateCreateStaffRoleRequest({...req.body})
    .then((requestBody)=> {
        getStaffRoleByTitle(requestBody.title)
        .then((foundStaffRole)=> {
            if(foundStaffRole) return sendConflictFailureResponse(res, "Staff role with title already exist")

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
            .catch((error)=> {
                console.log("There was an error inserting staff role into db", error);
    
                const serverError = new ServerError();
                return sendFailureResponse({res, statusCode: serverError.statusCode, message: serverError.message})
            })
        })
        .catch((error)=> {
            console.log("There was an error checking if staff role exists", error);
    
            const serverError = new ServerError();
            return sendFailureResponse({res, statusCode: serverError.statusCode, message: serverError.message})
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