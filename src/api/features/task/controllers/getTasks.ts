import { Request, Response } from "express";
import fetchTasks from "../services/fetchTasks";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

export default function getTasks(req:Request, res:Response) {
    fetchTasks(parseInt(req.params.pageNumber))
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