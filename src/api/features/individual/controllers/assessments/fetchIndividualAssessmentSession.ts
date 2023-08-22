import { NotFoundError, ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import createIndividualAssessmentSession from "@individual/services/individualAssesments/createIndividualAssessmentSession";
import createAssessmentSession from "@individual/services/individualAssesments/createIndividualAssessmentSession";
import getIndividualAssessmentSession from "@individual/services/individualAssesments/getIndividualAssessmentSession";
import { getAssessmentByAssessmentId, getAssessmentByObjId } from "@services/db/assessment.service";
import { getIndividualByIndividualId } from "@services/db/individual.service";
import { Request, Response } from "express";

export interface IAssessmentSessionResponse {
    id:string;
    title:string;
    status:string;
    questions:Array<{
        id:string;
        question:string;
        answer:string;
        comment:string;
    }>;
}

export default function fetchIndividualAssessmentSession(req:Request, res:Response) {

    const requestBody = {
        individualId: parseInt(req.params.individualId),
        assessmentId: req.params.assessmentId
    }

    getAssessmentByObjId(requestBody.assessmentId)
    .then((foundAssessment)=> {
        if(!foundAssessment) {
            const notFoundError = new NotFoundError("Assessment not found");
            return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
        }

        getIndividualByIndividualId(requestBody.individualId)
        .then((foundIndividual)=> {
            if(!foundIndividual) {
                const notFoundError = new NotFoundError("Individual not found");
                return sendFailureResponse({ 
                    res, 
                    statusCode: notFoundError.statusCode, 
                    message: notFoundError.message 
                });
            }

            // check if session exist
            getIndividualAssessmentSession(foundAssessment._id.toString(), foundIndividual._id.toString())
            .then((foundIndividualAssessmentSession)=> {

                if(!foundIndividualAssessmentSession) {
                    if(
                        foundAssessment.assignees.assigneesType === 'ALL' ||
                        foundAssessment.assignees.assigneesList.includes(foundIndividual._id.toString())
                    ) {
                        createIndividualAssessmentSession(foundAssessment._id.toString(), foundIndividual._id.toString())
                        .then((createdAssessmentSession)=> {
                            const assessmentSession:IAssessmentSessionResponse = {
                                id: createdAssessmentSession._id.toString(),
                                title: foundAssessment.title,
                                status: createdAssessmentSession.status!,
                                questions: createdAssessmentSession.questions.map(question => ({
                                    ...question,
                                    id: question._id.toString()
                                })),
                            }

                            return sendSuccessResponse({
                                res,
                                statusCode: 200,
                                message: "",
                                data: { assessmentSession: assessmentSession }
                            })
                        })
                        .catch((error)=> {
                            console.log("There was a server error", error);
                            return sendServerFailureResponse(res);  
                        })
                    } else {
                        return sendNotFoundFailureResponse(res, "Individual assessment session not found");
                    }

                } else {

                    const assessmentSession:IAssessmentSessionResponse = {
                        id: foundIndividualAssessmentSession._id.toString(),
                        title: foundAssessment.title,
                        status: foundIndividualAssessmentSession.status!,
                        questions: foundIndividualAssessmentSession.questions.map(question => ({
                            ...question,
                            id: question._id.toString()
                        })),
                    }

                    return sendSuccessResponse({
                        res, 
                        statusCode: 200, 
                        message: "Individual assessment session retrieved", 
                        data: { assessmentSession: assessmentSession }
                    })
                }
            });
        })
        .catch((error)=> {
            console.log("There was a server error", error);
            return sendServerFailureResponse(res);   
        })
    })
    .catch((error)=> {
        console.log("There was an error retrieving assessment")
        console.log(error)

        return sendServerFailureResponse(res);
    })
}

function sendNotFoundFailureResponse(res:Response, message:string) {
    const notFoundError = new NotFoundError(message);
    return sendFailureResponse({ res, statusCode:notFoundError.statusCode, message:notFoundError.message })
}

function sendServerFailureResponse(res:Response) {
    const serverError = new ServerError();
    return sendFailureResponse({res, statusCode: serverError.statusCode, message: serverError.message});
}