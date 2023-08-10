import { Request, Response } from "express";
import completeTask from "../../services/completeTask";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import createBowelMovementHistory from "../../services/bowel-movement/history/createBowelMovementHistory";

export default function completeBowelMovementTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        amount: req.body.amount,
        note: req.body.note
    }

    validateBowelMovementTaskRequest(requestData)
    .then((data)=> {
        // create goal tracking history within individual goal tracking field
        completeTask(data.taskId)
        .then((completedTask)=> {
            if(!completedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            createBowelMovementHistory({
                individualId: completedTask.individualId,
                amount: data.amount,
                note: data.note
            })
            .then(()=> {

                fetchTaskDetails(completedTask.taskId)
                .then((foundTask)=> {
                    console.log("Bowel movement created successfully");
                    return sendSuccessResponse({ res, statusCode: 201, message:"Bowel movement task completed successfully", data: { task: foundTask } })  
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
    amount:number;
    note:string;
}

export function validateBowelMovementTaskRequest(data:ICompleteGoalTrackingTaskRequest) {
    return new Promise<ICompleteGoalTrackingTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });
        if(!data.amount) reject({ code:401, message:"Time taken field must be provided" });
        if(!data.note) reject({ code:401, message:"Note field must be provided" });

        resolve(data)
    })
}