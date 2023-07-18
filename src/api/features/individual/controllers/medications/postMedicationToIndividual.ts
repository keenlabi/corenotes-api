import { ConflictError, ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchIndividualMedications from "@individual/services/fetchIndividualMedications";
import { getIndividualByIndividualId, updateIndividualMedicationsByIndividualId } from "@services/db/individual.service";
import { Request, Response } from "express";
import createNewMedicationTask from "src/api/features/task/services/medication/createNewMedicationTask";

export default function postMedicationToIndividual(req:Request, res:Response) {
    getIndividualByIndividualId(parseInt(req.params.individualId))
    .then((foundIndividual)=> {
        const match = foundIndividual.medications?.filter(medication => medication.medicationId === req.body.medicationId);
        
        if(match?.length) {
            const conflictError = new ConflictError('This medication has already been assigned to user');
            return sendFailureResponse({
                res,
                statusCode: conflictError.statusCode,
                message: conflictError.message
            })
        }

        updateIndividualMedicationsByIndividualId({
            individualId: parseInt(req.params.individualId), 
            medicationId: req.body.medicationId,
            schedule: req.body.schedule,
            amountAllocated: req.body.amountAllocated
        })
        .then((updatedIndividual)=> {
            if(!updatedIndividual) {
                return sendFailureResponse({
                    res,
                    statusCode: 404,
                    message: "Individual not found"
                })
            }

            const newMedication = updatedIndividual.medications?.filter(medication => medication.medicationId === req.body.medicationId);

            createNewMedicationTask({
                ...newMedication[0],
                individualId: foundIndividual._id.toString()
            })
            .then(()=> {
                console.log("New medication task created successfully")
            })
            .catch((error)=> {
                console.log("There was an error creating medication task", error)
            })

            fetchIndividualMedications(parseInt(req.params.individualId), 1)
            .then((response)=> {
                sendSuccessResponse({
                    res,
                    statusCode: 200,
                    message: "Medication selected for individual successfully",
                    data: response
                })
            })
            .catch((error)=> {
                console.log("There was an error fetching individual medications",  error)
                const serverError = new ServerError();
                return sendFailureResponse({ ...serverError, res })
            })
        })
        .catch((error)=> {
            console.log("There was an error updating individual with new medication", error)
            const serverError  = new ServerError();
            return sendFailureResponse({
                res,
                statusCode: serverError.statusCode,
                message: "There was an error creating medication for individual"
            })
        })
    })
    .catch((error)=> {
        console.log("There was an error finding individual in create medication endpoint", error)
        const serverError  = new ServerError();
        return sendFailureResponse({
            res,
            statusCode: serverError.statusCode,
            message: "There was an error creating medication for individual"
        })
    })
}