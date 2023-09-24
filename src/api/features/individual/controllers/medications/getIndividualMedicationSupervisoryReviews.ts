import { ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { getMedicationByMedicationId } from "src/api/shared/services/db/medication.service";
import { Request, Response } from "express";
import fetchIndividualMedicationSupervisoryReviews from "../../services/fetchIndividualMedicationSupervisoryReviews";

export default function getIndividualMedicationSupervisoryReview(req:Request, res:Response) {
    const individualId:number = parseInt(req.params.individualId);
    const medicationId:number = parseInt(req.params.medicationId);
    const pageNumber:number = parseInt(req.params.pageNumber)

    getMedicationByMedicationId(medicationId)
    .then((foundMedication)=> {
        const medicationObjectId = foundMedication?._id.toString()!;
        
        fetchIndividualMedicationSupervisoryReviews(individualId, medicationObjectId, pageNumber)
        .then((response)=> {
            return sendSuccessResponse({
                res,
                statusCode: 200,
                message: "Medication supervisory reviews retrieved successfully",
                data: response,
            })
        })
        .catch((error)=> {
            console.log(error);

            const serverError = new ServerError();
            return sendFailureResponse({ res, ...serverError })
        })
    });
}