import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchAllServices from "../services/fetchAllServices";

export default function fetchServices(req:Request, res:Response) {
    fetchAllServices(parseInt(req.params.pageNumber) ?? 1)
    .then((paginatedServices)=> {
        sendSuccessResponse({
            res,
            statusCode: 200,
            message:"Services retrieved successfully",
            data: { services: paginatedServices }
        });
    })
    .catch((error)=> {
        console.log('There was an error fetching all services')
        console.log(error)
        sendFailureResponse({ res, statusCode: 500, message: "There was a server error, not your fault, we're on it"});
    })
}