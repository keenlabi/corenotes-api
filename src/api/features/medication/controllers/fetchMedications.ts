import { Request, Response } from "express";
import fetchMedicationsList from "../services/fetchMedicationsList";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";

export default function fetchMedications(req:Request, res:Response) {
    fetchMedicationsList(parseInt(req.params.pageNumber))
    .then((response)=> {
        return sendSuccessResponse({
            res,
            statusCode: 201,
            message: "Medication saved successfully",
            data: response
        })
    })
    .catch((error)=> {
        console.log(error);
        const serverError = new ServerError();
        return sendFailureResponse({ 
            res, 
            statusCode: serverError.statusCode,
            message: serverError.message
        })
    });
}