import { Request, Response } from "express";
import fetchService from "../services/fetchService";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";

export default function fetchServiceDetails(req:Request, res:Response) {
    fetchService(parseInt(req.params.serviceId))
    .then((service)=> {
        return sendSuccessResponse({ res, statusCode: 200, message: "Service retrieved successfully", data: { service: service } })
    })
    .catch((error)=> {
        const serverError = new ServerError();
        return sendFailureResponse({ res, statusCode: serverError.statusCode, message: serverError.message });
    })
}