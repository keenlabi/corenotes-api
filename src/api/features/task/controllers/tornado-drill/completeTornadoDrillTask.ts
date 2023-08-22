import { Request, Response } from "express";
import completeTask from "../../services/completeTask";
import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchTaskDetails from "../../services/fetchTaskDetails";

export default function completeTornadoDrillTask(req:Request, res:Response) {

    const requestData = {
        taskId: parseInt(req.params.taskId),
        staffId: req.currentUser.staffObjectId!,
        noOfIndividuals: req.body.noOfIndividuals,
        didStaffAnnounce: req.body.didStaffAnnounce,
        didIndividualsEvacuate: req.body.didIndividualsEvacuate,
        note: req.body.note
    }

    validateCompleteTornadoDrillTaskRequest(requestData)
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
                console.log("Tornado drill task completed successfully");
                return sendSuccessResponse({ res, statusCode: 201, message:"Tornado drill task completed successfully", data: { task: foundTask } })  
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

export interface ICompleteTornadoDrillTaskRequest {
    taskId:number;
    staffId:string;
    noOfIndividuals:number;
    didStaffAnnounce:string;
    didIndividualsEvacuate:string;
    note:string;
}

export function validateCompleteTornadoDrillTaskRequest(data:ICompleteTornadoDrillTaskRequest) {
    return new Promise<ICompleteTornadoDrillTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code: 422, message:"Task id parameter must be provided" });
        if(!data.noOfIndividuals) reject({ code: 422, message:"Number of individuals field must be provided" });
        if(!data.didStaffAnnounce) reject({ code:401, message:"Did staff announce field must be provided" });
        if(!data.didIndividualsEvacuate) reject({ code:401, message:"Did individual evacuate field must be provided" });

        resolve(data)
    })
}