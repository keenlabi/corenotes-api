import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import fetchDailyLivingActivityServices from "./fetchDailyLivingActivityServices"

export default function fetchIndividualDailyLivingActivityServices(req:Request, res:Response) {
    fetchDailyLivingActivityServices(parseInt(req.params.individualId), parseInt(req.params.pageNumber))
    .then((response)=> {
        return sendSuccessResponse({
            res, statusCode: 201, message:"Daily living actitivies retrieved successfully", data: response
        })
    })
    .catch((error)=> {
        console.log("There was an error retrieving daily living activity list", error)
        return sendFailureResponse({
            res, statusCode: 201, message:"There was an error fetching daily living activities"
        })
    })
}