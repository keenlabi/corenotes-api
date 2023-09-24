import { Request, Response } from "express";
import { ServerError, ValidationError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

import { RequestFileType } from "@globals/middlewares/uploadFile";
import { getIndividualByObjectId } from "src/api/shared/services/db/individual.service";
import uploadFileToCloud from "src/api/shared/services/fileSystem/uploadFileToCloud";
import completeTask from "../../services/completeTask";
import createTaskHistory from "../../services/createTaskHistory";
import fetchTaskDetails from "../../services/fetchTaskDetails";

export interface IAdministerMedicationTaskRequest {
    taskId:number;
    topicalPhoto?:RequestFileType,
    note:string;
}

export default function administerUncontrolledMedicationTask(req:Request, res:Response) {
    validateAdministerUncontrolledMedicationTaskRequest({ ...req.body, topicalPhoto: req.file, ...req.params })
    .then(async (requestBody)=> {

        console.log(requestBody)
        
        let imageUrl:string;

        if(requestBody.topicalPhoto) {
            console.log(requestBody.topicalPhoto)
            imageUrl = await uploadFileToCloud(requestBody?.topicalPhoto, 'medication-asdministration/topical');
        }

        completeTask(requestBody.taskId)
        .then(async (completedTask)=> {

            const individual = await getIndividualByObjectId(completedTask!.individualId);
            
            createTaskHistory({
                individualId: individual!.individualId,
                individualMedicationId: "",
                medicationId: completedTask?.medicationId!,
                amountAdministered: 0,
                title: "Medication administration",
                image: imageUrl,
                note: req.body.note,
                staffId: req.currentUser.staffId!
            })
            .then(()=> {
                fetchTaskDetails(requestBody.taskId)
                .then((response)=> {
                    return sendSuccessResponse({
                        res, 
                        statusCode: 200, 
                        message: "Medication administered, and Task completed successfully",
                        data: { task: response }
                    })
                })
                .catch((error)=> {
                    console.log(error)

                    const serverError = new ServerError();
                    return sendFailureResponse({
                        res, 
                        statusCode: serverError.statusCode,
                        message: serverError.message
                    })
                })
            })
        })
        .catch((error)=> {
            console.log(error)

            const serverError = new ServerError();
            return sendFailureResponse({
                res, 
                statusCode: serverError.statusCode,
                message: serverError.message
            })
        })
    })
    .catch((error)=> {
        const validationError = new ValidationError(error.message);
        return sendFailureResponse({
            res, 
            statusCode: validationError.statusCode,
            message: validationError.message
        })
    })
}

function validateAdministerUncontrolledMedicationTaskRequest(data:IAdministerMedicationTaskRequest) {
    return new Promise<IAdministerMedicationTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });

        resolve(data)
    })
}