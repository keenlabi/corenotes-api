import { NotFoundError, ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { individualAssessmentModel } from "@individual/models/individual-assessment.model";
import getIndividualAssessmentSession from "@individual/services/individualAssesments/getIndividualAssessmentSession";
import { getIndividualByIndividualId } from "@services/db/individual.service";
import { Request, Response } from "express"
import { IAssessmentSessionResponse } from "./fetchIndividualAssessmentSession";
import { getAssessmentByObjId } from "@services/db/assessment.service";

export default function completeIndividualAssessmentSession(req:Request, res:Response) {

    getIndividualByIndividualId(parseInt(req.params.individualId))
    .then((foundIndividual)=> {
        const query = { 
            "individualId": foundIndividual?._id.toString(), 
            "assessmentId": req.params.assessmentId 
        };

        const updateObj = {
            $set: {
                status: "COMPLETED",
                questions: req.body.questions
            }
        }

        individualAssessmentModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividualAssessment)=> {
            if(!updatedIndividualAssessment) {
                const notFoundError = new NotFoundError("Individual assessment not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message })
            }

            getAssessmentByObjId(query.assessmentId)
            .then((foundAssessment)=> {
                if(!foundAssessment) {
                    const notFoundError = new NotFoundError("Individual assessment not found");
                    return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message })
                }

                const assessmentSession:IAssessmentSessionResponse = {
                    id: updatedIndividualAssessment._id.toString(),
                    title: foundAssessment.title,
                    status: updatedIndividualAssessment.status!,
                    questions: updatedIndividualAssessment.questions.map(question => ({
                        ...question,
                        id: question._id.toString()
                    })),
                }
    
                return sendSuccessResponse({
                    res,
                    statusCode: 200,
                    message: "Assessment completed successfully",
                    data: { assessmentSession: assessmentSession }
                })
            })
            .catch((error)=> {
                console.log("There was an error finding assessment", error)
                return sendFailureResponse({
                    res, statusCode: 500, message: "There was an error finding assessment"
                })
            })
        })
        .catch((error)=> {
            console.log("There was an error ", error);

            const serverError = new ServerError();
            return sendFailureResponse({ res, statusCode: serverError.statusCode, message: serverError.message })   
        })
    })


    // userModel.findOneAndUpdate(
    //     query,
    //     {
    //         $set: { 
    //             "assessments.$.status": 'COMPLETED',
    //             "assessments.$.questions": req.body.questions 
    //         }
    //     },
    //     { new: true }
    // )
    // .then((updatedUser:IUserDocument)=> {
    //     console.log('INDIVIDUAL ASSESSMENT: Individual assessment session completed successfully')
    //     const assessmentSession = updatedUser.assessments.filter(assessment => assessment._id.toString() === req.params.assessmentId)[0]

    //     const findAssessmentQuery = { _id: assessmentSession.assessmentId }
    //     assessmentModel.findOne(findAssessmentQuery)
    //     .then(async (foundAssessment)=> {
    //         const modifiedUpdatedAssessment = {
    //             id: assessmentSession._id,
    //             title: foundAssessment.title,
    //             category: await fetchAssessmentCategoryDetails(foundAssessment.category),
    //             status: assessmentSession.status,
    //             questions: assessmentSession.questions.map(question => ({
    //                 id: question._id,
    //                 question: question.question,
    //                 answer: question.answer,
    //                 comment: question.comment
    //             }))
    //         }
    
    //         sendSuccessResponse({res, statusCode:200, message:"Assessment session completed successfully", data: { individualAssessmentSession:  modifiedUpdatedAssessment }})
    //     })
    // })
    // .catch((error)=> {
    //     console.log('INDIVIDUAL ASSESSMENT ERROR: There was an error completing the individual assessment session => ', error)
    //     sendFailureResponse({res, statusCode:500, message:"There was an error completing the individual assessment session"});
    // })
}