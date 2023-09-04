import { Request, Response } from "express";
import fetchMedicationsList from "../services/fetchMedicationsList";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";

export default function fetchMedications(req:Request, res:Response) {
    
    const medType:string = req.query.medType?.toString()! || "";
    const pageNumber:number = parseInt(req.query.pageNumber?.toString()!);

    fetchMedicationsList(medType, pageNumber)
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