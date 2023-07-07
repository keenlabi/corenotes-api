import { Request, Response } from "express";
import fetchAllIndividualServices from "../services/fetchAllIndividualServices";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";

export default function fetchIndividualServices(req:Request, res:Response) {
    fetchAllIndividualServices(parseInt(req.params.individualId))
    .then((individualServices)=> {
        return sendSuccessResponse({
            res, statusCode: 200, 
            message:"Individual services retrieved successfully",
            data: { individualServices }
        })
    })
    .catch((error)=> {
        const serverError = new ServerError();
        return sendFailureResponse({
            res, statusCode: serverError.statusCode, message:serverError.message
        })
    })

}