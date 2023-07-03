import { Request, Response } from "express";
import getProvidedServices from "../services/getProvidedServices";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";

export default function fetchProvidedServices(req:Request, res:Response) {
    getProvidedServices(parseInt(req.params.pageNumber))
    .then((foundProvidedServices)=> {
        return sendSuccessResponse({ 
            res, 
            statusCode: 200, 
            message:"Provided services retrieved successfully", 
            data: foundProvidedServices 
        })
    })
    .catch((error)=> {
        const serverError = new ServerError();
        return sendFailureResponse({ res, statusCode: serverError.statusCode, message: serverError.message })
    })
}