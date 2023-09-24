import { Request, Response } from "express";
import completeTask from "../../services/completeTask";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import { getIndividualByObjectId } from "src/api/shared/services/db/individual.service";

export default function completeBehaviorManagementTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        staffId: req.currentUser.staffObjectId!,
        note: req.body.note,
        intervention: req.body.intervention
    }

    console.log(requestData);

    validateBehaviorManagementTaskRequest(requestData)
    .then(async (data)=> {
        // create goal tracking history within individual goal tracking field

        completeTask(data.taskId)
        .then(async (completedTask)=> {
            
            if(!completedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            fetchTaskDetails(completedTask.taskId)
            .then((foundTask)=> {
                console.log("Behavior management task completed successfully");
                return sendSuccessResponse({ 
                    res, 
                    statusCode: 201, 
                    message:"Behavior management task completed successfully", 
                    data: { task: foundTask }
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
        return sendFailureResponse({ res, statusCode: error.code, message: error.message });
    });
}

export interface ICompleteBloodGlucoseCheckTaskRequest {
    taskId:number;
    staffId:string;
    note:string;
    intervention:string;
}

export function validateBehaviorManagementTaskRequest(data:ICompleteBloodGlucoseCheckTaskRequest) {
    return new Promise<ICompleteBloodGlucoseCheckTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });
        if(!data.staffId) reject({ code:401, message:"Staff id field must be provided" });
        if(!data.note) reject({ code:401, message:"Note field must be provided" });
        if(!data.intervention) reject({ code:401, message:"Intervention field must be provided" });

        resolve(data)
    })
}