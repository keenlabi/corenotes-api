import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { Request, Response } from "express";
import fetchAllIndividuals from "@individual/services/fetchAllServices";
import { ServerError } from "@globals/server/Error";

export default function fetchIndividuals(req:Request, res:Response) {
    fetchAllIndividuals(1)
    .then((responseIndividuals)=> {
        return sendSuccessResponse({
            res, 
            statusCode:200, 
            message: "Individuals retrieved successfully", 
            data: { individuals: responseIndividuals }
        })
    })
    .catch((error)=> {
        const serverError = new ServerError();

        if(error.statusCode !== serverError.statusCode) {
            return sendFailureResponse({
                res,
                statusCode: error.statusCode,
                message: error.message
            })
        }

        return sendFailureResponse({
            res,
            statusCode: serverError.statusCode,
            message: serverError.message
        })
    })
}