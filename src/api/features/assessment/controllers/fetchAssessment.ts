import fetchAssessmentDetails from "@assessment/services/fetchAssessmentDetails";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { Request, Response } from "express";

export default function fetchAssessment(req:Request, res:Response) {
   fetchAssessmentDetails(parseInt(req.params.assessmentId))
   .then((fetchAssessment)=> {
      return sendSuccessResponse({
         res,
         statusCode: 200,
         message: "Assessment retrieved successfully",
         data: { assessment: fetchAssessment }
      })
   })
   .catch((error)=> {
      return sendFailureResponse({ 
         res,
         statusCode: error.statusCode,
         message: error.message
     })
   })
}