import { Request, Response } from "express";
import { NotFoundError, ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import deactivateMedication from "@individual/services/deactivateMedication";
import fetchIndividualMedications from "@individual/services/fetchIndividualMedications";
import { getMedicationByMedicationId } from "src/api/shared/services/db/medication.service";

export default function patchDiscontinueMedication(req:Request, res:Response) {
    getMedicationByMedicationId(req.body.medicationId)
    .then((foundMedication)=> {
        if(!foundMedication) {
            const notFoundError = new NotFoundError("Medication not found");
            return sendFailureResponse({ res, ...notFoundError });
        }

        deactivateMedication(foundMedication._id.toString(), parseInt(req.params.individualId), req.body.active)
        .then(()=> {
            fetchIndividualMedications(parseInt(req.params.individualId), req.body.currentPage)
            .then((response)=> {
                console.log(response)
                return sendSuccessResponse({
                    res,
                    statusCode: 200,
                    message: "Medications retrieved successfully",
                    data: response
                })
            })
            .catch((error)=> {
                console.log("There was an error fetching individual medications",  error)
    
                const serverError = new ServerError();
                return sendFailureResponse({ ...serverError, res })
            })
        })
        .catch((error)=> sendFailureResponse({ res, ...error }))
    })
    .catch((error)=> sendFailureResponse({ res, ...error }))
}