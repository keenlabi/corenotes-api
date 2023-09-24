import { assessmentModel } from "src/api/features/assessment/model/assessment.model.ts";
import { sendNotFoundFailureResponse, sendServerFailureResponse, sendSuccessResponse, sendValidationFailureResponse } from "@globals/server/serverResponse";
import getAssessmentsByIndividualId from "@individual/services/individualAssesments/getAssessmentsByIndividualObjectId";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service";
import { Request, Response } from "express";
import getIndividualAssessmentSession from "@individual/services/individualAssesments/getIndividualAssessmentSession";

export default function addAssessmentToIndividual(req:Request, res:Response) {
    if(!req.params.individualId) return sendValidationFailureResponse(res, "Individual id parameter cannot be empty")
    if(!req.body.assessments?.length) return sendValidationFailureResponse(res, "Assessments field cannot be empty")

    const assessments:string[] = req.body.assessments;

    getIndividualByIndividualId(parseInt(req.params.individualId))
    .then(async (foundIndividual)=> {
        if(!foundIndividual) return sendNotFoundFailureResponse(res, "Individual not found")
        
        for await (const assessment of assessments) {
            const query = { _id: assessment };
            const updateObj = { $push: { assignees: foundIndividual._id.toString() } }

            await getIndividualAssessmentSession(assessment, foundIndividual._id.toString())
            .then((foundIndividualAssessmentSession)=> {
                assessmentModel.findOneAndUpdate(query, updateObj, { new: true })
                .then((updatedAssessment)=> {
                    if(!updatedAssessment) console.log(`Assessment ${assessment} doesn't exist`);
                    console.log(`Individual ${foundIndividual._id.toString()} assigned to assessment ${assessment} successfully`);
                })
                .catch((error)=> {
                    console.log("There was an error adding individual id to assessment assignees", error);
                    return sendServerFailureResponse(res, "There was an error adding assessment to individual");
                })
            })
            .catch((error)=> {
                console.log("There was an error checking if assessment has been assigned to individual", error);
                return sendServerFailureResponse(res, "There was an error adding assessment to individual");
            })
        }

        getAssessmentsByIndividualId(foundIndividual.individualId, 1)
        .then((foundIndividualAssessments)=> {
            return sendSuccessResponse({ res, statusCode: 200, message: "Assessment assigned to individual successfully", data: { individualAssessments: foundIndividualAssessments } })
        })
        .catch((error)=> {
            console.log("There was an error getting individual assessments list", error);
            return sendServerFailureResponse(res, "There was a server error, please try again.");
        })
    })
    .catch((error)=> {
        console.log("There was an error", error)
        return sendServerFailureResponse(res, "There was a server error, please try again.")
    })
}