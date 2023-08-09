import deductFromIndividualMedicationAmount from "@individual/controllers/medications/deductFromIndividualMedicationAmount";
import { Request, Response } from "express";
import validateAdministerMedicationTaskRequest from "../../services/validateAdministerMedicationTaskRequest";
import { ServerError, ValidationError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import completeTask from "../../services/completeTask";
import fetchTaskDetails from "../../services/fetchTaskDetails";

export default function administerMedicationTask(req:Request, res:Response) {
    validateAdministerMedicationTaskRequest({ ...req.body, ...req.params})
    .then((requestBody)=> {
        deductFromIndividualMedicationAmount(
            requestBody.taskId,
            requestBody.amountAdministered,
            requestBody.amountLeft
        )
        .then(()=> {
            completeTask(requestBody.taskId)
            .then(()=> {
                fetchTaskDetails(requestBody.taskId)
                .then((response)=> {
                    return sendSuccessResponse({
                        res, 
                        statusCode: 200, 
                        message: "Medication administered, and Task completed successfully",
                        data: { task: response }
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
    })
    .catch((error)=> {
        console.log(error)

        const validationError = new ValidationError(error.message);
        return sendFailureResponse({
            res, 
            statusCode: validationError.statusCode,
            message: validationError.message
        })
    })
}