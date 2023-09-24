import { NotFoundError, ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import administerPRNMedication from "@individual/services/administerPRNMedication";
import fetchIndividualMedicationPRNs from "@individual/services/fetchIndividualMedicationPRNs";
import { getIndividualByObjectId } from "src/api/shared/services/db/individual.service";
import { getStaffUserById } from "src/api/shared/services/db/staff.service";
import { Request, Response } from "express";
import createPRNMedReviewTask from "src/api/features/task/services/prn-medication-review/createPRNMedReviewTask";
import { IIMakePRNMedReviewTaskDets } from "src/api/features/task/services/prn-medication-review/makePRNMedReviewTask";

export default function postPRNMedicationToIndividual(req:Request, res:Response) {
    getStaffUserById(req.currentUser.staffObjectId!)
    .then(async (foundStaff)=> {

        if(!foundStaff) {
            const notFoundError = new NotFoundError("Staff not found");
            return sendFailureResponse({ res, ...notFoundError })
        }

        const foundIndividual = await getIndividualByObjectId(req.params.individualId);

        if(!foundIndividual) {
            const notFoundError = new NotFoundError("Individual not found");
            return sendFailureResponse({ res, ...notFoundError })
        }

        administerPRNMedication({
            individualId: foundIndividual.individualId,
            individualMedicationId: req.body.individualMedicationId,
            medicationId: req.body.selectedMedicationId,
            amountAdministered: req.body.amountAdministered,
            note: req.body.note,
            staffId: foundStaff!.staffId
        })
        .then((administeredMedication)=> {
            // create new prn-effectiveness task
            
            const timeInMilliseconds = new Date(new Date().getTime() + 3600000);

            const newPRNMedReviewTask:IIMakePRNMedReviewTaskDets = {
                individualId: foundIndividual._id.toString(),
                administeredPRNId: administeredMedication.id,
                schedule: {
                    startDate: new Date().toISOString(),
                    frequency: "",
                    frequencyAttr: 0,
                    time: `${timeInMilliseconds.getHours()}:${timeInMilliseconds.getMinutes()}`
                }
            }

            createPRNMedReviewTask(newPRNMedReviewTask)
            .then((createdTask)=> {
                fetchIndividualMedicationPRNs(req.body.individualMedicationId)
                .then((response)=> {
                    return sendSuccessResponse({
                        res, 
                        statusCode: 201, 
                        message:"PRN medication administered successfully",
                        data: response
                    })
                })
                .catch((error)=> {
                    console.log(error)
                    return sendFailureResponse({ res, ...error })
                })
            })
        })
        .catch((error)=> {
            console.log(error)
            return sendFailureResponse({ res, ...error });
        })
    })
    .catch((error)=> {
        console.log(error)
        const serverError = new ServerError();
        return sendFailureResponse({ res, ...serverError });
    })
}