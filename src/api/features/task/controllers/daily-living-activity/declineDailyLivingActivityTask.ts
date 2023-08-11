import { Request, Response } from "express";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import declineTask from "../../services/declineTask";

export default function declineDailyLivingActivityTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
    }

    validateDeclineDailyLivingActivityTaskRequest(requestData)
    .then((data)=> {
        // create goal tracking history within individual goal tracking field
        declineTask(data.taskId)
        .then((declinedTask)=> {
            if(!declinedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            fetchTaskDetails(declinedTask.taskId)
            .then((foundTask)=> {
                console.log("Daily living activity task decline successfully");
                return sendSuccessResponse({ res, statusCode: 201, message:"Daily living activity task declined successfully", data: { task: foundTask } })  
            })
            .catch((error)=> {
                console.log(error);
                return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message });    
            })
        })
        .catch((error)=> {
            console.log(error);
            return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message });
        })
    })
    .catch((error)=> {
        console.log(error);
        return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message });
    });
}

export interface IDeclineDailyLivingActivityTaskRequest {
    taskId:number
}

export function validateDeclineDailyLivingActivityTaskRequest(data:IDeclineDailyLivingActivityTaskRequest) {
    return new Promise<IDeclineDailyLivingActivityTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });

        resolve(data)
    })
}