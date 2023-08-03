import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { NotFoundError, ServerError } from "@globals/server/Error";
import fetchIndividualMedications from "@individual/services/fetchIndividualMedications";
import completeSupervisoryMedicationReview from "@individual/services/completeSupervisoryMedicationReview";
import fetchIndividualMedicationSupervisoryReviews from "@individual/services/fetchIndividualMedicationSupervisoryReviews";
import { getMedicationByMedicationId } from "@services/db/medication.service";

export default function patchIndividualMedicationSupervisoryReview(req:Request, res:Response) {
    completeSupervisoryMedicationReview({
        individualId: parseInt(req.params.individualId),
        medicationId: req.body.medicationId,
        newPharmacy: req.body.newPharmacy,
        newAllocatedAmount: req.body.newAmountAllocated,
        staffObjectId: req.currentUser.staffObjectId
    })
    .then(async (updatedIndividual)=> {
        if(!updatedIndividual) {
            const notFoundError = new NotFoundError('Individual or medication profile not found');
            return sendFailureResponse({
                res, 
                statusCode: notFoundError.statusCode,
                message: notFoundError.message
            })
        }

        const individualId = updatedIndividual.individualId;
        const medicationId = parseInt(req.body.medicationId);
        const pageNumber = 1;

        const foundMedication = await getMedicationByMedicationId(medicationId);

        if(!foundMedication) {
            const notFoundError = new NotFoundError("Medication not found");
            return sendFailureResponse({ res, ...notFoundError });
        }

        fetchIndividualMedicationSupervisoryReviews(individualId, foundMedication._id.toString(), pageNumber)
        .then((response)=> {

            return sendSuccessResponse({
                res,
                statusCode: 200,
                message: "Medication supervisory reviews retrieved successfully",
                data: response,
            })
        })
        .catch((error)=> {
            console.log(error)
            return sendFailureResponse({
                res,
                statusCode: 500,
                message: "Medication supervisory review submitted successful",
            })
        }) 
    })
    .catch((error)=> {
        const serverError = new ServerError();
        return sendFailureResponse({
            res, 
            statusCode: serverError.statusCode, 
            message: serverError.message
        })
    })
}