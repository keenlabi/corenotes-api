import { Request, Response } from "express";
import completeTask from "../../services/completeTask";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";

export default function completeSeizureTrackingTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        staffId: req.currentUser.staffObjectId!,
        note: req.body.note
    }

    validateCompleteSeizureTrackingTaskRequest(requestData)
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
                console.log("Seizure tracking task completed successfully");
                return sendSuccessResponse({ res, statusCode: 201, message:"Seizure tracking task completed successfully", data: { task: foundTask } })  
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

export interface ICompleteShiftNotesTaskRequest {
    taskId:number;
    staffId:string;
    note:string;
}

export function validateCompleteSeizureTrackingTaskRequest(data:ICompleteShiftNotesTaskRequest) {
    return new Promise<ICompleteShiftNotesTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });
        if(!data.note) reject({ code:401, message:"Note field must be provided" });

        resolve(data)
    })
}