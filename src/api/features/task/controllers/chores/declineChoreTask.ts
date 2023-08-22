import { Request, Response } from "express";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import declineTask from "../../services/declineTask";

export default function declineChoreTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        note: req.body.note
    }

    validateDeclineChoreTaskRequest(requestData)
    .then((data)=> {
        declineTask(data.taskId)
        .then((declinedTask)=> {
            if(!declinedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            } 

            fetchTaskDetails(declinedTask.taskId)
            .then((foundTask)=> {
                console.log("Chore task declined successfully");
                return sendSuccessResponse({ res, statusCode: 201, message:"Chore task declined successfully", data: { task: foundTask } })  
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
        return sendFailureResponse({ res, statusCode: error.code, message: error.message });
    });
}

export interface IDeclineBehaviorManagementTaskRequest {
    taskId:number;
    note:string;
}

export function validateDeclineChoreTaskRequest(data:IDeclineBehaviorManagementTaskRequest) {
    return new Promise<IDeclineBehaviorManagementTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });
        if(!data.note) reject({ code:401, message:"Note parameter must be provided" });

        resolve(data)
    })
}