import { Request, Response } from "express"
import { AssessmentCategoryModel } from "../../models/AssessmentModel"
import { IAssessmentCategory } from "../../models/AssessmentModel/types"
import { sendFailureResponse } from "../../utils/serverUtils/response"
import fetchAssessmentCategories from "./fetchAssessmentCategories"

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
        sendFailureResponse(res, 500, 'There was an error creating new assessment category')
    })
}