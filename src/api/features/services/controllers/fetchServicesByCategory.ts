import { Request, Response } from "express";
import getServicesByCategory from "../services/getServicesByCategory";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";

export default function fetchServicesByCategory(req:Request, res:Response) {
    getServicesByCategory(req.params.category, parseInt(req.params.pageNumber))
    .then((foundServices)=> {
        return sendSuccessResponse({
            res,
            statusCode: 200, 
            message: "Provided services retrieved successfully", 
            data: foundServices 
        })
    })
    .catch(()=> {
        const serverError = new ServerError();
        return sendFailureResponse({ 
            res, 
            statusCode: serverError.statusCode, 
            message: serverError.message 
        })
    })
}