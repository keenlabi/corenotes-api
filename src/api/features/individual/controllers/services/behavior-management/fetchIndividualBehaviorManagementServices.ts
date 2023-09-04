import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import fetchBehaviorManagementServices from "./fetchBehaviorManagementServices"

export default function fetchIndividualBehaviorManagementServices(req:Request, res:Response) {
    fetchBehaviorManagementServices(parseInt(req.params.individualId), parseInt(req.params.pageNumber))
    .then((response)=> {
        console.log(response)
        return sendSuccessResponse({
            res, 
            statusCode: 201, 
            message:"Behavior management services retrieved successfully", 
            data: response
        })
    })
    .catch((error)=> {
        console.log("There was an error retrieving behavior management services list", error)
        return sendFailureResponse({
            res, statusCode: 201, message:"There was an error fetching behavior management services"
        })
    })
}