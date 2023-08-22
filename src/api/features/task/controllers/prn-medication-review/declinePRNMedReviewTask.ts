import { Request, Response } from "express";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import declineTask from "../../services/declineTask";

export default function declinePRNMedReviewTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        note: req.body.note
    }

    validateDeclinePRNMedReviewTaskRequest(requestData)
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
                console.log("PRN medication review task decline successfully");
                return sendSuccessResponse({ res, statusCode: 201, message:"PRN medication review task declined successfully", data: { task: foundTask } })  
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

export interface IDeclinePRNMedReviewTaskRequest {
    taskId:number;
    note:string;
}

export function validateDeclinePRNMedReviewTaskRequest(data:IDeclinePRNMedReviewTaskRequest) {
    return new Promise<IDeclinePRNMedReviewTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:422, message:"Task id parameter must be provided" });
        if(!data.note) reject({ code:422, message:"Note must be provided" });

        resolve(data)
    })
}