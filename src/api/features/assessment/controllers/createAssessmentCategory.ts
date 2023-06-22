import { Request, Response } from "express"
import fetchAssessmentCategories from "./fetchAssessmentCategories"
import { AssessmentCategoryModel } from "@assessment/model/assessment.model.ts"
import { IAssessmentCategory } from "@assessment/model/assessment.model.ts/types"
import { sendFailureResponse } from "@globals/server/serverResponse"

export default function createAssessmentCategory(req:Request, res:Response) {
    const newAssessmemtCategory:Omit<IAssessmentCategory, '_id'|'createdAt'> = {
        name: req.body.assessmentCategoryName
    }

    AssessmentCategoryModel.create(newAssessmemtCategory)
    .then(()=> {
        console.log('RESOURCE CREATED: New assessment category has been created successfully')
        fetchAssessmentCategories(req, res);
    })
    .catch((error)=> {
        console.log('RESOURCE CREATION ERROR: There was an error creating new assessment category => ', error)
        sendFailureResponse({res, statusCode: 500, message: 'There was an error creating new assessment category'})
    })
}