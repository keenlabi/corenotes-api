import { Request, Response } from "express";
import validateAssignIndividualServiceRequest from "../../services/validateAssignIndividualServiceRequest";
import { ServerError, ValidationError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import addServiceToIndividual from "../../services/addServiceToIndividual";
import { getServiceByObjectId } from "src/api/shared/services/db/service.service";
import createSkinIntegrityTask from "src/api/features/task/services/skin-integrity/createSkinIntegrityTask";
import { IIMakeSkinIntegrityTaskDets } from "src/api/features/task/services/skin-integrity/makeSkinIntegrityTask";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service";
import { IIMakeBowelMovementTaskDets } from "src/api/features/task/services/bowel-movement/makeBowelMovementTask";
import createBowelMovementTask from "src/api/features/task/services/bowel-movement/createBowelMovementTask";
import createShiftNotesTask from "src/api/features/task/services/shift-notes/createShiftNotesTask";
import { IIMakeShiftNotesTaskDets } from "src/api/features/task/services/shift-notes/makeShiftNotesTask";
import { IIMakeBloodGlucoseCheckTaskDets } from "src/api/features/task/services/blood-glucose-check/makeBloodGlucoseCheckTask";
import createBloodGlucoseCheckTask from "src/api/features/task/services/blood-glucose-check/createBloodGlucoseCheckTask";
import { IIMakeSeizureTrackingTaskDets } from "src/api/features/task/services/seizure-tracking/makeSeizureTrackingTask";
import createSeizureTrackingTask from "src/api/features/task/services/seizure-tracking/createSeizureTrackingTask";
import { IIMakeFireDrillTaskDets } from "src/api/features/task/services/fire-drill/makeFireDrillTask";
import createFireDrillTask from "src/api/features/task/services/fire-drill/createFireDrillTask";
import createTornadoDrillTask from "src/api/features/task/services/tornado-drill/createTornadoDrillTask";
import { IIMakeTornadoDrillTaskDets } from "src/api/features/task/services/tornado-drill/makeTornadoDrillTask";

export default function assignIndividualServices(req:Request, res:Response) {
    validateAssignIndividualServiceRequest({...req.body, ...req.params})
    .then((requestBody)=> {
        addServiceToIndividual({...requestBody})
        .then(async (individualServices)=> {

            const servicesToCreateTasksForOnAssign = ["skin-integrity", "bowel-movement", "behavioral-management", "shift-notes", "blood-glucose-check", "seizure-tracking", "fire-drill", "tornado-drill"];

            const service = await getServiceByObjectId(requestBody.serviceId)
            if(service) {

                if(servicesToCreateTasksForOnAssign.includes(service.refName)) {
                    
                    const individual = await getIndividualByIndividualId(parseInt(requestBody.individualId));

                    if(service.refName === "skin-integrity") {
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

                    if(service.refName === "bowel-movement") {

                        const bowelMovementDets:IIMakeBowelMovementTaskDets = {
                            individualId: individual?._id.toString()!,
                            bowelMovement: true,
                            schedule: requestBody.schedule
                        }
                        
                        createBowelMovementTask(bowelMovementDets)
                        .then((createdTask)=> {
                            if(!createdTask) {
                                console.log("Bowel movement task was not created successfully")
                            }
                        })
                        .catch((error)=> {
                            console.log("There was an error creating a skin integrity task")
                            console.log(error);
                        })
                    }

                    if(service.refName === "shift-notes") {

                        const shiftNotes:IIMakeShiftNotesTaskDets = {
                            individualId: individual?._id.toString()!,
                            shiftNotes: true,
                            schedule: requestBody.schedule
                        }
                        
                        createShiftNotesTask(shiftNotes)
                        .catch((error)=> {
                            console.log("There was an error creating a shift notes task")
                            console.log(error);
                        })
                    }

                    if(service.refName === "blood-glucose-check") {

                        const bloodGlucoseCheck:IIMakeBloodGlucoseCheckTaskDets = {
                            individualId: individual?._id.toString()!,
                            bloodGlucoseCheck: true,
                            schedule: requestBody.schedule
                        }
                        
                        createBloodGlucoseCheckTask(bloodGlucoseCheck)
                        .catch((error)=> {
                            console.log("There was an error creating a blood glucose check task")
                            console.log(error);
                        })
                    }

                    if(service.refName === "seizure-tracking") {

                        const seizureTracking:IIMakeSeizureTrackingTaskDets = {
                            individualId: individual?._id.toString()!,
                            seizureTracking: true,
                            schedule: requestBody.schedule
                        }
                        
                        createSeizureTrackingTask(seizureTracking)
                        .catch((error)=> {
                            console.log("There was an error creating a seizure tracking task")
                            console.log(error);
                        })
                    }

                    if(service.refName === "fire-drill") {

                        const fireDrill:IIMakeFireDrillTaskDets = {
                            individualId: individual?._id.toString()!,
                            fireDrill: true,
                            schedule: requestBody.schedule
                        }
                        
                        createFireDrillTask(fireDrill)
                        .catch((error)=> {
                            console.log("There was an error creating a fire drill task")
                            console.log(error);
                        })
                    }

                    if(service.refName === "tornado-drill") {
                        const tornadoDrill:IIMakeTornadoDrillTaskDets = {
                            individualId: individual?._id.toString()!,
                            tornadoDrill: true,
                            schedule: requestBody.schedule
                        }
                        
                        createTornadoDrillTask(tornadoDrill)
                        .catch((error)=> {
                            console.log("There was an error creating a tornado drill task")
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