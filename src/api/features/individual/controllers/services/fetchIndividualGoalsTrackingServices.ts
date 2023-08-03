import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import fetchGoalTrackingServices from "./fetchGoalTrackingServices"

export default function fetchIndividualGoalsTrackingServices(req:Request, res:Response) {
    fetchGoalTrackingServices(parseInt(req.params.individualId), parseInt(req.params.pageNumber))
    .then((response)=> {
        console.log(response)
        return sendSuccessResponse({
            res, statusCode: 201, message:"New goal added successfully", data: response
        })
    })
    .catch((error)=> {
        console.log("There was an error fetching goals list", error)
        return sendFailureResponse({
            res, statusCode: 201, message:"There was an error fetching goals"
        })
    })
}