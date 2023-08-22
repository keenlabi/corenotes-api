import { Request, Response } from "express";
import completeTask from "../../services/completeTask";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";

export default function completePRNMedReviewTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        note: req.body.note
    }

    validateCompletePRNMedReviewTaskRequest(requestData)
    .then((data)=> {
        // create goal tracking history within individual goal tracking field
        completeTask(data.taskId)
        .then((completedTask)=> {
            if(!completedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            fetchTaskDetails(completedTask.taskId)
            .then((foundTask)=> {
                console.log("PRN medication reviewed successfully");
                return sendSuccessResponse({ res, statusCode: 201, message:"PRN medication reviewed successfully", data: { task: foundTask } })  
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

export interface ICompleteGoalTrackingTaskRequest {
    taskId:number
    note:string;
}

export function validateCompletePRNMedReviewTaskRequest(data:ICompleteGoalTrackingTaskRequest) {
    return new Promise<ICompleteGoalTrackingTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:422, message:"Task id parameter must be provided" });
        if(!data.note) reject({ code:422, message:"Note field must be provided" });

        resolve(data)
    })
}