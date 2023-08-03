import { Request, Response } from "express";
import fetchTaskDetails from "../services/fetchTaskDetails";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

export default function getTask(req:Request, res:Response) {
    fetchTaskDetails(parseInt(req.params.taskId))
    .then((response)=> {
        return sendSuccessResponse({
            res,
            statusCode: 200,
            message: "Tasks details retrieved successfully",
            data: { task: response }
        })
    })
    .catch((error)=> {
        console.log("There was an error retrieving tasks, try again", error)
        return sendFailureResponse({
            res,
            statusCode: 500,
            message:"There was an error retrieving task details"
        })
    })
}