import { Request, Response } from "express";
import completeTask from "../../services/completeTask";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import createDailyLivingActivityHistory from "../../services/daily-living-activity/history/createDailyLivingActivityHistory";

export default function completeDailyLivingActivityTaskService(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        note: req.body.note
    }

    validateCompleteDailyLivingActivityTaskRequest(requestData)
    .then((data)=> {
        // create goal tracking history within individual goal tracking field
        completeTask(data.taskId)
        .then((completedTask)=> {
            if(!completedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            createDailyLivingActivityHistory({
                individualId: completedTask.individualId,
                dailyLivingActivityId: completedTask.dailyLivingActivityId!,
                note: data.note
            })
            .then(()=> {

                fetchTaskDetails(completedTask.taskId)
                .then((foundTask)=> {
                    console.log("Daily living activity history created successfully");
                    return sendSuccessResponse({ res, statusCode: 201, message:"Daily living activity history created successfully", data: { task: foundTask } })  
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

export interface ICompleteDailyLivingActivityTaskRequest {
    taskId:number;
    note:string;
}

export function validateCompleteDailyLivingActivityTaskRequest(data:ICompleteDailyLivingActivityTaskRequest) {
    return new Promise<ICompleteDailyLivingActivityTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });
        if(!data.note) reject({ code:401, message:"Note field must be provided" });

        resolve(data)
    })
}