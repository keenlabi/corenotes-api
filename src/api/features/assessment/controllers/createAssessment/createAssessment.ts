import { Request, Response } from "express";
import validateCreateAssessmentReq from "./validateCreateAssessmentReq";
import { validateCreateAssessmentType } from "./types";
import { IAssessment } from "@assessment/model/assessment.model.ts/types";
import { AssessmentModel } from "@assessment/model/assessment.model.ts";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

export default function createAssessment(req:Request, res:Response) {
    validateCreateAssessmentReq(req.body)
    .then(({requestBody}:validateCreateAssessmentType)=> {

        const newAssessmentObj:Omit<IAssessment, 'createdAt' | '_id'> = {
            title: requestBody.title.toLowerCase(),
            category: requestBody.category,
            questions: requestBody.questions,
            assignees: requestBody.assignees
        }

        AssessmentModel.create(newAssessmentObj)
        .then(()=> {
            console.log('RESOURCE CREATED: new assessment created successfully')
            sendSuccessResponse({res, statusCode:201, message:"Assessment created successfully", data:{}})
        })
        .catch((error)=> {
            console.log(error)
            sendFailureResponse({res, statusCode:422, message:error.message ?? "There was an error creating new assessment"});
        })
    })
    .catch((error)=> {
        console.log('VALIDATION ERROR: ', error.message)
        sendFailureResponse({res, statusCode:422, message:error.message ?? "There was an error validating new assessment body"});
    })
}