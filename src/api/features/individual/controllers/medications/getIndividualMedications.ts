import { ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchIndividualMedications from "@individual/services/fetchIndividualMedications";
import { Request, Response } from "express";

export default function getIndividualMedications(req:Request, res:Response) {
    fetchIndividualMedications(parseInt(req.params.individualId), parseInt(req.params.pageNumber))
    .then((response)=> {
        return sendSuccessResponse({
            res,
            statusCode: 200,
            message: "Medications retrieved successfully",
            data: response
        })
    })
    .catch((error)=> {
        console.log("There was an error fetching individual medications",  error)
        const serverError = new ServerError();
        return sendFailureResponse({ ...serverError, res })
    })
}