import { Request, Response } from "express"
import { AssessmentCategoryModel, AssessmentQuestionsCategoryModel } from "../../models/AssessmentModel"
import { sendFailureResponse, sendSuccessResponse } from "../../utils/serverUtils/response"
import { IAssessmentCategory, IAssessmentQuestionCategory } from "../../models/AssessmentModel/types"

export default function fetchAssessmentCategories(req:Request, res:Response) {
    AssessmentCategoryModel.find()
    .sort({createdAt: -1})
    .then((foundCategories:IAssessmentCategory[])=> {
        const mappedFoundCategories = foundCategories.map(category => ({
            id: category._id,
            name: category.name
        }))

        AssessmentQuestionsCategoryModel.find()
        .sort({createdAt: -1})
        .then((foundQuestionCategories:IAssessmentQuestionCategory[])=> {
            const mappedFoundQuestionCategories = foundQuestionCategories.map(category => ({
                id: category._id,
                name: category.name
            }))

            sendSuccessResponse(res, 200, "Assessment categories retrieved successfully", {assessmentCategories: mappedFoundCategories, questionCategories: mappedFoundQuestionCategories})
        })
        .catch((error)=> {
            console.log('QUERY ERROR: There was an error finding assessment question categories => ', error)
            sendFailureResponse(res, 500, 'Error finding assessment categories');
        })
    })
    .catch((error)=> {
        console.log('QUERY ERROR: There was an error finding assessment categories => ', error)
        sendFailureResponse(res, 500, 'Error finding assessment categories');
    })
}