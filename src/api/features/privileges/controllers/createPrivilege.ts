import { Request, Response } from "express";
import validateCreatePrivilegeRequest from "../services/validateCreatePrivilegeRequest";
import { ServerError, ValidationError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import addNewPrivilege from "../services/addNewPrivilege";
import fetchAllPrivileges from "../services/fetchAllPrivileges";

export default function createPrivilege(req:Request, res:Response) {
    validateCreatePrivilegeRequest(req.body)
    .then((requestBody)=> {

        addNewPrivilege(requestBody)
        .then(()=> {
            fetchAllPrivileges(1)
            .then((response)=> {
                return sendSuccessResponse({ 
                    res, 
                    statusCode: 200,
                    message: "Privileges retrieved successfully",
                    data: response
                })
            })
            .catch((error)=> {
                
                console.log("There was an error fetching all privileges");
                console.log(error)

                const serverError = new ServerError();
                return sendFailureResponse({
                    res,
                    statusCode: serverError.statusCode,
                    message: serverError.message
                })
            })
            
        })
        .catch(()=> {
            const serverError = new ServerError();
            return sendFailureResponse({
                res,
                statusCode: serverError.statusCode,
                message: serverError.message
            })
        })
    })
    .catch((error)=> {
        const validationError = new ValidationError(error.message);
        return sendFailureResponse({
            res,
            statusCode: validationError.statusCode,
            message: validationError.message
        })
    })
}