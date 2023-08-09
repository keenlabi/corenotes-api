import { NotFoundError, ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { IIndividualMedication } from "@individual/models/types";
import { getIndividualByMedicationBarcode } from "@services/db/individual.service";
import { getTaskByMedicationId } from "@services/db/task.service";
import { Request, Response } from "express";

export default function findMedicationTaskByBarcode(req:Request, res:Response) {
    getIndividualByMedicationBarcode(req.params.barcode)
    .then((foundIndividual)=> {
        if(!foundIndividual) {
            const notFoundError = new NotFoundError('Individual not found');
            return sendFailureResponse({
                res, statusCode: notFoundError.statusCode, message: notFoundError.message
            })
        }

        const medicationMatch:IIndividualMedication = foundIndividual!.medications.filter(medication => medication.barcode === req.params.barcode)[0];
        
        getTaskByMedicationId(medicationMatch.medicationId, foundIndividual._id.toString(), medicationMatch.schedule.startDate, medicationMatch.schedule.time)
        .then((foundTask)=> {
            if(!foundTask) {
                const notFoundError = new NotFoundError('There is no active task for this medication yet');
                return sendFailureResponse({
                    res, statusCode: notFoundError.statusCode, message: notFoundError.message
                })
            }

            return sendSuccessResponse({
                res, 
                statusCode: 200, 
                message: "Task retrieved successfully", 
                data: { 
                    task: foundTask 
                }
            })
        })
        .catch((error)=> {
            const serverError = new ServerError();
            return sendFailureResponse({
                res, statusCode: error.statusCode || serverError.statusCode, message: error.statusCode || serverError.message
            })
        })

    })
    .catch((error)=> {
        console.log(error)
        const serverError = new ServerError();
        return sendFailureResponse({
            res, statusCode: error.statusCode || serverError.statusCode, message: error.statusCode || serverError.message
        })
    })
}