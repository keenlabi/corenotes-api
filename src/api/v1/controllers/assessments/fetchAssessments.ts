import { Request, Response } from "express"
import { AssessmentModel } from "../../models/AssessmentModel";
import { IAssessment } from "../../models/AssessmentModel/types";
import { sendFailureResponse, sendSuccessResponse } from "../../utils/serverUtils/response";
import fetchAssessmentCategoryDetails from "./utils/fetchAssessmentCategoryDetails";
import fetchAssessmentQuestionCategoryDetails from "./utils/fetchAssessmentQuestionCategoryDetails";
import { Types } from "mongoose";
import { UserModel } from "../../models";
import { IUser } from "../../models/UserModel/types";

interface IAssessmentMapped extends Omit<IAssessment, '_id'|'createdAt'|'assignees'> {
    id:Types.ObjectId|String,
    status:'PENDING'|'IN-PROGRESS'|'COMPLETED'    
}

export default function fetchAssessments(req:Request, res:Response) {

    const   pageNumber = parseInt(req.params.pageNumber) - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * pageNumber,

            query = { $or: [
                    { 'assignees.assigneesType': 'ALL' },
                    { 'assignees.assigneesList': req.params.individualId }
                ]
            };
            
    AssessmentModel.find(query)
    .skip(pageOffset)
    .limit(resultsPerPage)
    .sort({ createdAt: -1 })
    .then(async (foundAssessments:IAssessment[])=> {

        // assign the found assessments to this individual
        
        const individualQuery = { _id: req.params.individualId }

        const individualAssessments:Array<{
            assessmentId:Types.ObjectId|String,
            status:'PENDING'|'IN-PROGRESS'|'COMPLETED'
        }> = [];

        const mappedAssessments:any[] = [];

        for await (const assessment of foundAssessments) {
            let assessmentMap:IAssessmentMapped = {
                id:assessment._id,
                title: assessment.title,
                category: await fetchAssessmentCategoryDetails(assessment.category),
                questions: [],
                status: 'COMPLETED'
            };
        
            await UserModel.findOne(individualQuery)
            .then(async(foundIndividual:IUser)=> {
                if(foundIndividual && !foundIndividual.assessments.filter( individualAssessment => individualAssessment.assessmentId === assessment._id.toString()).length) {
                    individualAssessments.push({
                        assessmentId: assessment._id,
                        status: 'PENDING',
                    })
                }
                
                const assessmentExistsCheck = foundIndividual.assessments.filter( individualAssessment => individualAssessment.assessmentId === assessment._id.toString());
                assessmentMap.status =  assessmentExistsCheck.length ? assessmentExistsCheck[0].status : 'PENDING'

                for await (const question of assessment.questions) {
                    assessmentMap.questions.push({
                        question: question.question,
                        category: await fetchAssessmentQuestionCategoryDetails(question.category)
                    })
                }
            })
            
            mappedAssessments.push(assessmentMap)
        }

        UserModel.findOneAndUpdate(
            individualQuery,
            { $push: { assessments: individualAssessments } },
            { new: true } 
        ).then((updatedUser)=> {
            console.log('INDIVIDUAL PROFILE: New Individual assessments added successfully')

            AssessmentModel.count(query)
            .then((totalAssessments)=> {
                const totalPageNumber = Math.ceil(totalAssessments / resultsPerPage);
                return sendSuccessResponse(res, 200, "Assessments retrieved successfully", { 
                    currentPage: parseInt(req.params.pageNumber), 
                    totalPages: totalPageNumber,
                    assessments: mappedAssessments
                })
            })
        }).catch((error)=> {
            console.log('INDIVIDUAL PROFILE ERROR: There was an error assigning new tasks to individual profile')
        })
    })
    .catch((error)=> {
        console.log(`QUERY ERROR: There was an error fetching all assessments`)
        console.log(error)
        return sendFailureResponse(res, 500, "There was an error fetching assessments")
    })

}