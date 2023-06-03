import { Request, Response } from "express"
import { AssessmentQuestionsCategoryModel } from "../../models/AssessmentModel"
import { IAssessmentQuestionCategory } from "../../models/AssessmentModel/types"
import { sendFailureResponse } from "../../utils/serverUtils/response"
import fetchAssessmentCategories from "./fetchAssessmentCategories"

export default function createQuestionCategory(req:Request, res:Response) {
    const newQuestionCategory:Omit<IAssessmentQuestionCategory, '_id'|'createdAt'> = {
        name: req.body.questionCategoryName
    }

    AssessmentQuestionsCategoryModel.create(newQuestionCategory)
    .then(()=> {
        console.log('RESOURCE CREATED: New assessment question category has been created successfully')
        fetchAssessmentCategories(req, res);
    })
    .catch((error)=> {
        console.log('RESOURCE CREATION ERROR: There was an error creating new assessment question category => ', error)
        sendFailureResponse(res, 500, 'There was an error creating new assessment question category')
    })
}