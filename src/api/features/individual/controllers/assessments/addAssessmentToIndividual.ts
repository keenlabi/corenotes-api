import { assessmentModel } from "src/api/features/assessment/model/assessment.model.ts";
import { sendNotFoundFailureResponse, sendServerFailureResponse, sendSuccessResponse, sendValidationFailureResponse } from "@globals/server/serverResponse";
import getAssessmentsByIndividualId from "@individual/services/individualAssesments/getAssessmentsByIndividualObjectId";
import { getIndividualByIndividualId } from "@services/db/individual.service";
import { Request, Response } from "express";

export default function addAssessmentToIndividual(req:Request, res:Response) {
    if(!req.params.individualId) return sendValidationFailureResponse(res, "Individual id parameter cannot be empty")
    if(!req.body.assessments?.length) return sendValidationFailureResponse(res, "Assessments field cannot be empty")

    const assessments:string[] = req.body.assessments;

    getIndividualByIndividualId(parseInt(req.params.individualId))
    .then(async (foundIndividual)=> {
        if(!foundIndividual) return sendNotFoundFailureResponse(res, "Individual not found")
        try {
            for await (const assessment of assessments) {
        
                const query = { _id: assessment };
                const updateObj = { 
                    $push: { assignees: req.params.individual }
                }

                assessmentModel.findOne(query)
                .then((foundAssessment)=> {
                    if(!foundAssessment?.assignees?.includes(foundIndividual._id.toString())) {
                        assessmentModel.findOneAndUpdate(query, updateObj, { new: true })
                        .then(()=> {
                            console.log(`Individual ${foundIndividual._id.toString()} assigned to assessment successful ${assessment}`)
                        })
                        .catch((error)=> console.log(error))
                    }
                })
                .catch((error)=> console.log(error))
            }

            getAssessmentsByIndividualId(foundIndividual.individualId, 1)
            .then((foundIndividualAssessments)=> {
                return sendSuccessResponse({res, statusCode: 200, message: "Assessment assigned to individual successfully", data: foundIndividualAssessments })
            })
            .catch((error)=> {
                console.log("There was an error getting individual assessments list", error);
                return sendServerFailureResponse(res, "There was a server error, please try again.");
            })

        } catch (error) {
            console.log(error)
            return sendServerFailureResponse(res, "There was a server error, please try again.")
        }
    })
    .catch((error)=> {
        console.log("There was an error", error)
        return sendServerFailureResponse(res, "There was a server error, please try again.")
    })
}