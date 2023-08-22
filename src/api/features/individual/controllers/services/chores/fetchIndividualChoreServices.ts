import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import fetchChoreServices from "./fetchChoreServices"

export default function fetchIndividualChoreServices(req:Request, res:Response) {
    fetchChoreServices(parseInt(req.params.individualId), parseInt(req.params.pageNumber))
    .then((response)=> {
        return sendSuccessResponse({
            res, 
            statusCode: 201, 
            message:"Chore services retrieved successfully", 
            data: response
        })
    })
    .catch((error)=> {
        console.log("There was an error retrieving chore services list", error)
        return sendFailureResponse({
            res, statusCode: 201, message:"There was an error fetching chore services"
        })
    })
}