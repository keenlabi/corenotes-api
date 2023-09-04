import { Request, Response } from "express";
import completeTask from "../../services/completeTask";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";
import createBloodGlucoseCheckHistory from "../../services/blood-glucose-check/history/createBloodGlucoseCheckHistory";
import { getIndividualByObjectId } from "@services/db/individual.service";

export default function completeBloodGlucoseCheckTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        individualId: req.body.individualId,
        staffId: req.currentUser.staffObjectId!,
        note: req.body.note
    }

    validateBloodGlucoseCheckTaskRequest(requestData)
    .then(async (data)=> {
        // create goal tracking history within individual goal tracking field

        completeTask(data.taskId)
        .then(async (completedTask)=> {
            
            if(!completedTask) {
                const notFoundError = new NotFoundError("Task not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            const foundIndividual = await getIndividualByObjectId(data.individualId)
            if(!foundIndividual) {
                const notFoundError = new NotFoundError("Individual not not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message });
            }

            createBloodGlucoseCheckHistory({
                individualId: foundIndividual._id.toString(),
                staffId: data.staffId,
                note: data.note
            }).then(()=> {

                fetchTaskDetails(completedTask.taskId)
                .then((foundTask)=> {
                    console.log("Blood glucose check task completed successfully");
                    return sendSuccessResponse({ res, statusCode: 201, message:"Blood glucose check task completed successfully", data: { task: foundTask } })  
                })
                .catch((error)=> {
                    console.log(error);
                    return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message });    
                })
            }).catch((error)=> {
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

export interface ICompleteBloodGlucoseCheckTaskRequest {
    taskId:number;
    individualId:string;
    staffId:string;
    note:string;
}

export function validateBloodGlucoseCheckTaskRequest(data:ICompleteBloodGlucoseCheckTaskRequest) {
    return new Promise<ICompleteBloodGlucoseCheckTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });
        if(!data.individualId) reject({ code:401, message:"Individual id field must be provided" });
        if(!data.staffId) reject({ code:401, message:"Staff id field must be provided" });
        if(!data.note) reject({ code:401, message:"Note field must be provided" });

        resolve(data)
    })
}