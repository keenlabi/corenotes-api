import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import addToIndividualMedicationAllocatedAmount from "@individual/services/addToIndividualMedicationAllocatedAmount";
import { NotFoundError, ServerError } from "@globals/server/Error";
import fetchIndividualMedications from "@individual/services/fetchIndividualMedications";

export default function patchIndividualMedicationAllocatedAmount(req:Request, res:Response) {
    addToIndividualMedicationAllocatedAmount(parseInt(req.params.individualId), req.body.medicationId, req.body.newAmountAllocated)
    .then((updatedIndividual)=> {
        if(!updatedIndividual) {
            const notFoundError = new NotFoundError('Individual or medication profile not found');
            return sendFailureResponse({
                res, 
                statusCode: notFoundError.statusCode,
                message: notFoundError.message
            })
        }

        fetchIndividualMedications(parseInt(req.params.individualId), 1)
        .then((response)=> {
            return sendSuccessResponse({
                res, 
                statusCode: 200,
                message: "New medication pills allocated to individual successfully",
                data: response
            })  
        })
        .catch((error)=> {
            if(!error.message) {
                const serverError = new ServerError();
                return sendFailureResponse({
                    res, 
                    statusCode: serverError.statusCode, 
                    message: serverError.message
                })
            }

            return sendFailureResponse({
                res, 
                statusCode: error.statusCode,
                message: error.message,
            })  
        })
    })
    .catch((error)=> {
        console.log(error)
        const serverError = new ServerError();
        return sendFailureResponse({
            res, 
            statusCode: serverError.statusCode, 
            message: serverError.message
        })
    })
}