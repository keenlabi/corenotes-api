import { Request, Response } from "express";
import { UserModel } from "../../../models";
import { IUser } from "../../../models/UserModel/types";
import { sendFailureResponse, sendSuccessResponse } from "../../../utils/serverUtils/response";
import { AssessmentModel } from "../../../models/AssessmentModel";
import { IAssessment } from "../../../models/AssessmentModel/types";
import fetchAssessmentCategoryDetails from "../../assessments/utils/fetchAssessmentCategoryDetails";

export default function fetchIndividualAssessmentSession(req:Request, res:Response) {
    const checkIfAssessmentIsAssignedToIndividual = { 'assessments.assessmentId': req.params.assessmentId }

    UserModel.findOne(checkIfAssessmentIsAssignedToIndividual)
    .then((foundUser:IUser)=> {
        if(!foundUser) return sendFailureResponse(res, 404, "Assessment hasn't been assigned to this individual");

        
        const selectedAssessment = foundUser.assessments.filter(assessment => assessment.assessmentId === req.params.assessmentId)[0];

        let action_type:string = 'retrieved';

        const findAssessmentDetailsQuery = { _id: selectedAssessment.assessmentId }

        AssessmentModel.findOne(findAssessmentDetailsQuery)
        .then((foundAssessment:IAssessment)=> {
            const findIndividualQuery = { "assessments.assessmentId": selectedAssessment.assessmentId }

            if(selectedAssessment.status === 'PENDING') {
                action_type = 'created'

                UserModel.findOneAndUpdate(
                    findIndividualQuery,
                    {
                        $set: { 
                            "assessments.$.questions": foundAssessment.questions,
                            "assessments.$.status": 'IN-PROGRESS'
                        }
                    },
                    { new: true }

                )
                .then(async (updatedUser:IUser)=> {

                    const updatedAssessment = updatedUser.assessments.filter(assessment => assessment.assessmentId === req.params.assessmentId)[0];

                    const modifiedUpdatedAssessment = {
                        id: updatedAssessment._id,
                        title: foundAssessment.title,
                        category: await fetchAssessmentCategoryDetails(foundAssessment.category),
                        status: updatedAssessment.status,
                        questions: updatedAssessment.questions.map(question => ({
                            id: question._id,
                            question: question.question,
                            answer: question.answer,
                            comment: question.comment
                        }))
                    }

                    console.log(`INDIVIDUAL ASSESSMENT: Individual assessment session has been ${action_type} successfully`)
                    sendSuccessResponse(res, 200, 'Assessment session created successfully', { individualAssessmentSession: modifiedUpdatedAssessment })

                })
                .catch((error)=> {
                    console.log(error)
                    sendFailureResponse(res, 500, `There was an error ${action_type} assessment session`)
                })

            } else {
                UserModel.findOne(findIndividualQuery)
                .then(async (updatedUser:IUser)=> {
                    const updatedAssessment = updatedUser.assessments.filter(assessment => assessment.assessmentId === req.params.assessmentId)[0];
                   
                    const modifiedUpdatedAssessment = {
                        id: updatedAssessment._id,
                        title: foundAssessment.title,
                        category: await fetchAssessmentCategoryDetails(foundAssessment.category),
                        status: updatedAssessment.status,
                        questions: updatedAssessment.questions.map(question => ({
                            id: question._id,
                            question: question.question,
                            answer: question.answer,
                            comment: question.comment
                        }))
                    }
                   
                    console.log(`INDIVIDUAL ASSESSMENT: Individual assessment session has been ${action_type} successfully`)
                    sendSuccessResponse(res, 200, `Assessment session ${action_type} successfully`, { individualAssessmentSession: modifiedUpdatedAssessment })
                })
                .catch((error)=> {
                    console.log(error)
                    sendFailureResponse(res, 500, 'There was an error creating assessment session')
                })
            }
        })
    })
    .catch((error)=> {
        console.log('QUERY ERROR: There was an error checking if assessment has been assigned to individual => ', error)
        sendFailureResponse(res, 500, 'There was an error finding assessment session')
    })

}