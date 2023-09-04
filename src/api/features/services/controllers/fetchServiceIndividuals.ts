import { Request, Response } from "express";
import getServiceIndividuals from "../services/getServiceIndividuals";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";

export default function fetchServiceIndividuals(req:Request, res:Response){
    getServiceIndividuals(parseInt(req.params.serviceId), parseInt(req.params.pageNumber))
    .then((serviceIndividualsResponse)=> {
        return sendSuccessResponse({
            res,
            statusCode: 200,
            message: "Service individuals retrieved successfully",
            data: serviceIndividualsResponse
        })
    })
    .catch((error)=> {
        if(error.statusCode !== 500) {
            return sendFailureResponse({
                res,
                statusCode: error.statusCode,
                message: error.message
            })
        }

        const serverError = new ServerError();
        return sendFailureResponse({
            res,
            statusCode: serverError.statusCode,
            message: serverError.message
        })
    })
}