import fetchAssessmentCategoryDetails from "@assessment/controllers/utils/fetchAssessmentCategoryDetails";
import { AssessmentModel } from "@assessment/model/assessment.model.ts";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { IUserDocument } from "@user/models/types";
import userModel from "@user/models/user.model";
import { Request, Response } from "express"

export default function completeIndividualAssessmentSession(req:Request, res:Response) {

    const query = { "assessments._id": req.params.assessmentId };

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
    //     AssessmentModel.findOne(findAssessmentQuery)
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