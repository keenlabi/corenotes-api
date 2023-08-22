import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import getAssessmentsByIndividualId from "@individual/services/individualAssesments/getAssessmentsByIndividualObjectId";
import { Request, Response } from "express";

export default function fetchIndividualAssessments(req:Request, res:Response) {
    getAssessmentsByIndividualId(parseInt(req.params.individualId), parseInt(req.params.pageNumber))
    .then((response)=> {
        return sendSuccessResponse({
            res,
            statusCode: 200,
            message: "Individual assessment retrieved successfully",
            data: { individualAssessments: response }
        })
    })
    .catch((error)=> {
        console.log(error)
        return sendFailureResponse({ res, statusCode: error.statusCode, message:"There was an error fetching individual assessments" })
    })
}