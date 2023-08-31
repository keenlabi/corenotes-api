import { Request, Response } from "express";
import createNewPRNTask from "../services/createNewPRNTask";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

export default function postPRNTask(req:Request, res:Response) {
    const requestBody = {
        individualId: parseInt(req.body.individualId),
        serviceId: parseInt(req.body.serviceId),
        schedule: req.body.schedule,
    }

    createNewPRNTask(requestBody)
    .then((response)=> {
        return sendSuccessResponse({
            res,
            statusCode: 200,
            message: "Tasks retrieved successfully",
            data: response
        })
    })
    .catch((error)=> {
        console.log("There was an error retrieving tasks, try again", error)
        return sendFailureResponse({
            res,
            statusCode: 500,
            message:"There was an error retrieving tasks"
        })
    })
}