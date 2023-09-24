import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { getMedicationsByServiceObjectId } from "src/api/shared/services/db/medication.service";
import { Request, Response } from "express";

export default function fetchServiceMedications(req:Request, res:Response) {
    getMedicationsByServiceObjectId(req.params.serviceObjectId, parseInt(req.params.pageNumber))
    .then((response)=> {

        return sendSuccessResponse({
            res, 
            statusCode: 200,
            message: "Medications retrieved successfully",
            data: response
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