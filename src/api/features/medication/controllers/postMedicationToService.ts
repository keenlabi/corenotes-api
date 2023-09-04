import { Request, Response } from "express";
import addMedicationToService from "../services/addMedicationToService";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

export default function postMedicationToService(req:Request, res:Response) {
    addMedicationToService(parseInt(req.params.medicationId), req.body.serviceId)
    .then((response)=> {
        return sendSuccessResponse({ 
            res, 
            statusCode: 200, 
            message: "Medication has been added to service successfully",
            data: { medication: response }
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