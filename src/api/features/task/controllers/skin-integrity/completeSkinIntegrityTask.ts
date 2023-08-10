import { Request, Response } from "express";
import completeTask from "../../services/completeTask";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import createSkinIntegrityHistory from "../../services/skin-integrity/history/createGoalTrackingHistory";

export default function completeSkinIntegrityTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        timeTaken: req.body.timeTaken,
        note: req.body.note
    }

    validateSkinIntegrityTaskRequest(requestData)
    .then((data)=> {
        // create goal tracking history within individual goal tracking field
        completeTask(data.taskId)
        .then((completedTask)=> {
            if(!completedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            createSkinIntegrityHistory({
                individualId: completedTask.individualId,
                timeTaken: data.timeTaken,
                note: data.note
            })
            .then(()=> {

                fetchTaskDetails(completedTask.taskId)
                .then((foundTask)=> {
                    console.log("Goal history created successfully");
                    return sendSuccessResponse({ res, statusCode: 201, message:"Goal history created successfully", data: { task: foundTask } })  
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
        })
    })
    .catch((error)=> {
        console.log(error);
        return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message });
    });
}

export interface ICompleteGoalTrackingTaskRequest {
    taskId:number
    timeTaken:number;
    note:string;
}

export function validateSkinIntegrityTaskRequest(data:ICompleteGoalTrackingTaskRequest) {
    return new Promise<ICompleteGoalTrackingTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });
        if(!data.timeTaken) reject({ code:401, message:"Time taken field must be provided" });
        if(!data.note) reject({ code:401, message:"Note field must be provided" });

        resolve(data)
    })
}