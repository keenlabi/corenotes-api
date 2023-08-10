import { AssessmentCategoryModel, AssessmentQuestionsCategoryModel } from "@assessment/model/assessment.model.ts"
import { IAssessmentCategoryDocument, IAssessmentQuestionCategoryDocument } from "@assessment/model/assessment.model.ts/types"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { Request, Response } from "express"

export default function fetchAssessmentCategories(req:Request, res:Response) {
    AssessmentCategoryModel.find()
    .sort({createdAt: -1})
    .then((foundCategories:IAssessmentCategoryDocument[])=> {
        const mappedFoundCategories = foundCategories.map(category => ({
            id: category._id,
            name: category.name
        }))

        AssessmentQuestionsCategoryModel.find()
        .sort({createdAt: -1})
        .then((foundQuestionCategories:IAssessmentQuestionCategoryDocument[])=> {
            const mappedFoundQuestionCategories = foundQuestionCategories.map(category => ({
                id: category._id,
                name: category.name
            }))

            sendSuccessResponse({res, statusCode:200, message:"Assessment categories retrieved successfully", data: {assessmentCategories: mappedFoundCategories, questionCategories: mappedFoundQuestionCategories}})
        })
        .catch((error)=> {
            console.log('QUERY ERROR: There was an error finding assessment question categories => ', error)
            sendFailureResponse({res, statusCode: 500, message:'Error finding assessment categories'});
        })
    })
    .catch((error)=> {
        console.log('QUERY ERROR: There was an error finding assessment categories => ', error)
        sendFailureResponse({res, statusCode: 500, message:'Error finding assessment categories'});
    })
}