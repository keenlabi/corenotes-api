import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse } from "../../../utils/serverUtils/response";
import validateCreateAssessmentReq from "./validateCreateAssessmentReq";
import { validateCreateAssessmentType } from "./types";
import { AssessmentModel } from "../../../models/AssessmentModel";
import { IAssessment } from "../../../models/AssessmentModel/types";

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
            sendSuccessResponse(res, 201, "Assessment created successfully", {})
        })
        .catch((error)=> {
            console.log(error)
            sendFailureResponse(res, 422, error.message ?? "There was an error creating new assessment");
        })
    })
    .catch((error)=> {
        console.log('VALIDATION ERROR: ', error.message)
        sendFailureResponse(res, 422, error.message ?? "There was an error validating new assessment body");
    })
}