import { Request, Response } from "express";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import declineTask from "../../services/declineTask";

export default function declineSkinIntegrityTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
    }

    validateDeclineSkinIntegrityTaskRequest(requestData)
    .then((data)=> {
        // create skin integrity history within individual skin integrity field
        declineTask(data.taskId)
        .then((declinedTask)=> {
            if(!declinedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            fetchTaskDetails(declinedTask.taskId)
            .then((foundTask)=> {
                console.log("Skin integrity task decline successfully");
                return sendSuccessResponse({ res, statusCode: 201, message:"Skin integrity task declined successfully", data: { task: foundTask } })  
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

export interface IDeclineSkinIntegrityTaskRequest {
    taskId:number
}

export function validateDeclineSkinIntegrityTaskRequest(data:IDeclineSkinIntegrityTaskRequest) {
    return new Promise<IDeclineSkinIntegrityTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });

        resolve(data)
    })
}