import { Request, Response } from "express"
import { UserModel } from "../../../models";
import { IUser } from "../../../models/UserModel/types";
import { sendFailureResponse, sendSuccessResponse } from "../../../utils/serverUtils/response";
import { AssessmentModel } from "../../../models/AssessmentModel";
import fetchAssessmentCategoryDetails from "../../assessments/utils/fetchAssessmentCategoryDetails";

export default function completeIndividualAssessmentSession(req:Request, res:Response) {

    const query = { "assessments._id": req.params.assessmentId };

    UserModel.findOneAndUpdate(
        query,
        {
            $set: { 
                "assessments.$.status": 'COMPLETED',
                "assessments.$.questions": req.body.questions 
            }
        },
        { new: true }
    )
    .then((updatedUser:IUser)=> {
        console.log('INDIVIDUAL ASSESSMENT: Individual assessment session completed successfully')
        const assessmentSession = updatedUser.assessments.filter(assessment => assessment._id.toString() === req.params.assessmentId)[0]

        const findAssessmentQuery = { _id: assessmentSession.assessmentId }
        AssessmentModel.findOne(findAssessmentQuery)
        .then(async (foundAssessment)=> {
            const modifiedUpdatedAssessment = {
                id: assessmentSession._id,
                title: foundAssessment.title,
                category: await fetchAssessmentCategoryDetails(foundAssessment.category),
                status: assessmentSession.status,
                questions: assessmentSession.questions.map(question => ({
                    id: question._id,
                    question: question.question,
                    answer: question.answer,
                    comment: question.comment
                }))
            }
    
            sendSuccessResponse(res, 200, "Assessment session completed successfully", { individualAssessmentSession:  modifiedUpdatedAssessment })
        })
    })
    .catch((error)=> {
        console.log('INDIVIDUAL ASSESSMENT ERROR: There was an error completing the individual assessment session => ', error)
        sendFailureResponse(res, 500, "There was an error completing the individual assessment session");
    })
}