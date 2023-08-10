import { Request, Response } from "express";
import validateAssignIndividualServiceRequest from "../../services/validateAssignIndividualServiceRequest";
import { ServerError, ValidationError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import addServiceToIndividual from "../../services/addServiceToIndividual";
import getServiceByServiceId from "src/api/features/services/services/db/getServiceByServiceId";
import { getServiceByObjectId } from "@services/db/service.service";
import createSkinIntegrityTask from "src/api/features/task/services/skin-integrity/createSkinIntegrityTask";
import { IIMakeSkinIntegrityTaskDets } from "src/api/features/task/services/skin-integrity/makeSkinIntegrityTask";
import { getIndividualByIndividualId } from "@services/db/individual.service";

export default function assignIndividualServices(req:Request, res:Response) {
    validateAssignIndividualServiceRequest({...req.body, ...req.params})
    .then((requestBody)=> {
        addServiceToIndividual({...requestBody})
        .then(async (individualServices)=> {

            const servicesToCreateTasksForOnAssign = ["skin-integrity"];

            const service = await getServiceByObjectId(requestBody.serviceId)
            if(service) {
                const serviceNameJoined = `${service.title.toLowerCase().split(" ").join("-")}`;
                if(servicesToCreateTasksForOnAssign.includes(serviceNameJoined)) {
                    
                    if(serviceNameJoined === servicesToCreateTasksForOnAssign[0]) {
                        const individual = await getIndividualByIndividualId(parseInt(requestBody.individualId));

                        const skinIntegrityDets:IIMakeSkinIntegrityTaskDets = {
                            individualId: individual?._id.toString()!,
                            skinIntegrity: true,
                            schedule: requestBody.schedule
                        }
                        createSkinIntegrityTask(skinIntegrityDets)
                        .then((createdTask)=> {
                            if(!createdTask) {
                                console.log("skin integrity task was not created successfully")
                            }
                        })
                        .catch((error)=> {
                            console.log("There was an error creating a skin integrity task")
                            console.log(error);
                        })
                    }
                }
            }

            return sendSuccessResponse({ 
                res, 
                statusCode: 201, 
                message: "New service added to individual successfully",
                data: { individualServices }
            })
        })
        .catch((error)=> {
            if(error.statusCode !== 500) {
                return sendFailureResponse({ res, statusCode: error.statusCode, message: error.message })
            }

            const serverError = new ServerError();
            return sendFailureResponse({ res, statusCode: serverError.statusCode, message: serverError.message })
        })
    })
    .catch((error)=> {

        console.log(error)
        const validationError = new ValidationError(error.message)
        return sendFailureResponse({ res, statusCode: validationError.statusCode, message: validationError.message })
    })
}