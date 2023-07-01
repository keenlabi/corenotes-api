import { Request, Response } from "express";
import validateAssignIndividualServiceRequest from "../services/validateAssignIndividualServiceRequest";
import { ServerError, ValidationError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import addServiceToIndividual from "../services/addServiceToIndividual";

export default function assignIndividualServices(req:Request, res:Response) {
    validateAssignIndividualServiceRequest({...req.body, ...req.params})
    .then((requestBody)=> {
        addServiceToIndividual(requestBody)
        .then((individualServices)=> {
            return sendSuccessResponse({ 
                res, 
                statusCode: 201, 
                message: "New service added to individual successfully",
                data: { individualServices }
            })
        })
        .catch((error)=> {
            console.log(error);
            if(error.statusCode === 404) {
                return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message })
            }

            const serverError = new ServerError();
            return sendFailureResponse({ res, statusCode: serverError.statusCode, message: serverError.message })
        })
    })
    .catch((error)=> {
        const validationError = new ValidationError(error.message)
        return sendFailureResponse({ res, statusCode: validationError.statusCode, message: validationError.message })
    })
}