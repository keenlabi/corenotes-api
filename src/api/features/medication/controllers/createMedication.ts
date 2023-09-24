import { Request, Response } from "express";
import validateCreateMedicationRequest from "../services/validateCreateMedicationRequest";
import makeMedication from "../services/makeMedication";
import saveMedication from "../services/saveMedication";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";
import fetchMedicationsList from "../services/fetchMedicationsList";
import { updateServiceMedicationsByServiceId } from "src/api/shared/services/db/service.service";

export default function createMedication(req:Request, res:Response) {
    validateCreateMedicationRequest(req.body)
    .then((requestBody)=> {
        const newMedData = makeMedication(requestBody);

        updateServiceMedicationsByServiceId(newMedData._id.toString(), 1)
        .then((updatedService)=> {
            
            newMedData.services.unshift(updatedService!._id.toString());

            saveMedication(newMedData)
            .then(()=> {
                fetchMedicationsList("", 1)
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
            })
            .catch((error)=> {
                console.log(error);
                const serverError = new ServerError();
                return sendFailureResponse({ 
                    res, 
                    statusCode: serverError.statusCode,
                    message: serverError.message
                })
            })
        })
        .catch((error)=> {
            return sendFailureResponse({
                res,
                statusCode: error.statusCode,
                message: "There was an error updating medication service with new medication"
            })
        })
    })
    .catch((error)=> {
        console.log(error);
        return sendFailureResponse({ 
            res, 
            statusCode: error.code,
            message: error.message
        })
    })
}

