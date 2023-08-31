import { IServiceScheduleSubDocument } from "src/api/shared/schema/schedule.schema";
import fetchTasks, { ITasksListResponse } from "./fetchTasks";
import getServiceByServiceId from "../../services/services/db/getServiceByServiceId";
import { getIndividualByIndividualId } from "@services/db/individual.service";
import { IIMakeSkinIntegrityTaskDets } from "./skin-integrity/makeSkinIntegrityTask";
import createSkinIntegrityTask from "./skin-integrity/createSkinIntegrityTask";
import { IIMakeBowelMovementTaskDets } from "./bowel-movement/makeBowelMovementTask";
import createBowelMovementTask from "./bowel-movement/createBowelMovementTask";
import { IIMakeShiftNotesTaskDets } from "./shift-notes/makeShiftNotesTask";
import createShiftNotesTask from "./shift-notes/createShiftNotesTask";
import { IIMakeBloodGlucoseCheckTaskDets } from "./blood-glucose-check/makeBloodGlucoseCheckTask";
import createBloodGlucoseCheckTask from "./blood-glucose-check/createBloodGlucoseCheckTask";
import { IIMakeSeizureTrackingTaskDets } from "./seizure-tracking/makeSeizureTrackingTask";
import createSeizureTrackingTask from "./seizure-tracking/createSeizureTrackingTask";
import { IIMakeFireDrillTaskDets } from "./fire-drill/makeFireDrillTask";
import createFireDrillTask from "./fire-drill/createFireDrillTask";
import { IIMakeTornadoDrillTaskDets } from "./tornado-drill/makeTornadoDrillTask";
import createTornadoDrillTask from "./tornado-drill/createTornadoDrillTask";

interface IRequestBody {
    individualId:number;
    serviceId:number;
    schedule:{
        startDate:string;
        endDate:string;
        time:string;
        frequency:string;
        frequencyAttr:number;
    }
}

export default function createNewPRNTask(requestBody:IRequestBody) {
    return new Promise<ITasksListResponse>(async (resolve, reject)=> {

        getServiceByServiceId(requestBody.serviceId)
        .then((service)=> {
            if(service) {
                getIndividualByIndividualId(requestBody.individualId)
                .then(async (individual)=> {

                    if(service.refName === "skin-integrity") {
                        const skinIntegrityDets:IIMakeSkinIntegrityTaskDets = {
                            individualId: individual?._id.toString()!,
                            skinIntegrity: true,
                            schedule: requestBody.schedule
                        }
                        
                        await createSkinIntegrityTask(skinIntegrityDets)
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
                        
                        await createBowelMovementTask(bowelMovementDets)
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
                        
                        await createShiftNotesTask(shiftNotes)
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
                        
                        await createBloodGlucoseCheckTask(bloodGlucoseCheck)
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
                        
                        await createTornadoDrillTask(tornadoDrill)
                        .catch((error)=> {
                            console.log("There was an error creating a tornado drill task")
                            console.log(error);
                        })
                    }

                    fetchTasks(1)
                    .then((response)=> resolve(response))
                    .catch((error)=> reject(error))
                })
                .catch((error)=> reject(error))
            }
        })
        .catch((error)=> reject(error))
    });
}