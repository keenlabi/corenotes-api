import { Request, Response } from "express"
import fetchAssessmentCategories from "./fetchAssessmentCategories"
import { IAssessmentQuestionCategory } from "@assessment/model/assessment.model.ts/types"
import { AssessmentQuestionsCategoryModel } from "@assessment/model/assessment.model.ts"
import { sendFailureResponse } from "@globals/server/serverResponse"

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
        sendFailureResponse({res, statusCode:500, message:'There was an error creating new assessment question category'})
    })
}