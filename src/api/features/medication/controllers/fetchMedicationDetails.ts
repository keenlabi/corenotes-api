import { Request, Response } from "express";
import fetchMedication from "../services/fetchMedication";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

export default function fetchMedicationDetails(req:Request, res:Response) {
    fetchMedication(parseInt(req.params.medicationId))
    .then((response)=> {
        return sendSuccessResponse({ 
            res, 
            statusCode: 200, 
            message: "Medication details retrieved succuessfully",
            data: { medication: response }
        })
    })
    .catch((error)=> {
        console.log(error)
        return sendFailureResponse({
            res,
            statusCode: error.statusCode,
            message: error.message
        })
    })
}