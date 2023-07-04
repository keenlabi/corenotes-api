import fetchAssessmentCategoryDetails from "@assessment/controllers/utils/fetchAssessmentCategoryDetails";
import { AssessmentModel } from "@assessment/model/assessment.model.ts";
import { IAssessment } from "@assessment/model/assessment.model.ts/types";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { IUserDocument } from "@user/models/types";
import userModel from "@user/models/user.model";
import { Request, Response } from "express";

export default function fetchIndividualAssessmentSession(req:Request, res:Response) {
    const checkIfAssessmentIsAssignedToIndividual = { 'assessments.assessmentId': req.params.assessmentId }

    // userModel.findOne(checkIfAssessmentIsAssignedToIndividual)
    // .then((foundUser:IUserDocument)=> {
    //     if(!foundUser) return sendFailureResponse({res, statusCode:404, message:"Assessment hasn't been assigned to this individual"});

        
    //     const selectedAssessment = foundUser.assessments.filter(assessment => assessment.assessmentId === req.params.assessmentId)[0];

    //     let action_type:string = 'retrieved';

    //     const findAssessmentDetailsQuery = { _id: selectedAssessment.assessmentId }

    //     AssessmentModel.findOne(findAssessmentDetailsQuery)
    //     .then((foundAssessment:IAssessment)=> {
    //         const findIndividualQuery = { "assessments.assessmentId": selectedAssessment.assessmentId }

    //         if(selectedAssessment.status === 'PENDING') {
    //             action_type = 'created'

    //             userModel.findOneAndUpdate(
    //                 findIndividualQuery,
    //                 {
    //                     $set: { 
    //                         "assessments.$.questions": foundAssessment.questions,
    //                         "assessments.$.status": 'IN-PROGRESS'
    //                     }
    //                 },
    //                 { new: true }

    //             )
    //             .then(async (updatedUser:IUserDocument)=> {

    //                 const updatedAssessment = updatedUser.assessments.filter(assessment => assessment.assessmentId === req.params.assessmentId)[0];

    //                 const modifiedUpdatedAssessment = {
    //                     id: updatedAssessment._id,
    //                     title: foundAssessment.title,
    //                     category: await fetchAssessmentCategoryDetails(foundAssessment.category),
    //                     status: updatedAssessment.status,
    //                     questions: updatedAssessment.questions.map(question => ({
    //                         id: question._id,
    //                         question: question.question,
    //                         answer: question.answer,
    //                         comment: question.comment
    //                     }))
    //                 }

    //                 console.log(`INDIVIDUAL ASSESSMENT: Individual assessment session has been ${action_type} successfully`)
    //                 sendSuccessResponse({res, statusCode:200, message:'Assessment session created successfully', data:{ individualAssessmentSession: modifiedUpdatedAssessment }})

    //             })
    //             .catch((error)=> {
    //                 console.log(error)
    //                 sendFailureResponse({res, statusCode:500, message:`There was an error ${action_type} assessment session`})
    //             })

    //         } else {
    //             userModel.findOne(findIndividualQuery)
    //             .then(async (updatedUser:IUserDocument)=> {
    //                 const updatedAssessment = updatedUser.assessments.filter(assessment => assessment.assessmentId === req.params.assessmentId)[0];
                   
    //                 const modifiedUpdatedAssessment = {
    //                     id: updatedAssessment._id,
    //                     title: foundAssessment.title,
    //                     category: await fetchAssessmentCategoryDetails(foundAssessment.category),
    //                     status: updatedAssessment.status,
    //                     questions: updatedAssessment.questions.map(question => ({
    //                         id: question._id,
    //                         question: question.question,
    //                         answer: question.answer,
    //                         comment: question.comment
    //                     }))
    //                 }
                   
    //                 console.log(`INDIVIDUAL ASSESSMENT: Individual assessment session has been ${action_type} successfully`)
    //                 sendSuccessResponse({res, statusCode:200, message:`Assessment session ${action_type} successfully`, data:{ individualAssessmentSession: modifiedUpdatedAssessment }})
    //             })
    //             .catch((error)=> {
    //                 console.log(error)
    //                 sendFailureResponse({res, statusCode:500, message:'There was an error creating assessment session'})
    //             })
    //         }
    //     })
    // })
    // .catch((error)=> {
    //     console.log('QUERY ERROR: There was an error checking if assessment has been assigned to individual => ', error)
    //     sendFailureResponse({res, statusCode:500, message:'There was an error finding assessment session'})
    // })

}