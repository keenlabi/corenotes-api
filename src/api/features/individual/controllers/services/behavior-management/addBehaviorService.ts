import { ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendNotFoundFailureResponse, sendServerFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { individualBehaviorServiceModel } from "@individual/models/individual-behavior-service.model";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service";
import fetchBehaviorManagementServices from "./fetchBehaviorManagementServices";
import createBehaviorManagementTask from "src/api/features/task/services/behavior-management/createBehaviorManagementTask";
import { IIMakeBehaviorManagementTaskDets } from "src/api/features/task/services/behavior-management/makeBehaviorManagementTask";

export default function addBehaviorService(req:Request, res:Response) {

    const newIndividualBehaviorData = {
        _id: new Types.ObjectId(),
        individualId:"",
        description: req.body.description,
        goals: req.body.goals,
        schedule: {
            startDate: req.body.schedule.startDate,
            endDate: req.body.schedule.endDate,
            time: req.body.schedule.time,
            frequency: req.body.schedule.frequency,
            frequencyAttr: req.body.schedule.frequencyAttr,
        }
    }

    getIndividualByIndividualId(parseInt(req.params.individualId))
    .then((foundIndividual)=> {
        if(!foundIndividual) return sendNotFoundFailureResponse(res, "Individual not found");

        newIndividualBehaviorData.individualId = foundIndividual._id.toString();

        individualBehaviorServiceModel.create(newIndividualBehaviorData)
        .then((createdIndividualBehavior)=> {

            const newTaskData:IIMakeBehaviorManagementTaskDets = {
                individualId: newIndividualBehaviorData.individualId,
                behaviorManagementId: createdIndividualBehavior._id.toString(),
                schedule: {
                    startDate: createdIndividualBehavior.schedule.startDate,
                    frequency: createdIndividualBehavior.schedule.frequency,
                    frequencyAttr: createdIndividualBehavior.schedule.frequencyAttr,
                    time: createdIndividualBehavior.schedule.time[0],
                }
            }

            createBehaviorManagementTask(newTaskData)
            .then(()=> {
                fetchBehaviorManagementServices(foundIndividual?.individualId!, 1)
                .then((foundIndividualBehaviors)=> {
                    return sendSuccessResponse({
                        res, 
                        statusCode: 201, 
                        message:"New individual behavior added successfully", 
                        data: foundIndividualBehaviors
                    })
                })
                .catch((error)=> {
                    console.log("There was an error fetching goals list", error)
                    return sendFailureResponse({
                        res, statusCode: 201, message:"There was an error fetching individual behavior"
                    })
                })
            })
            .catch((error)=> {
                console.log("There was an error creating new goal tracking task", error)
                return sendFailureResponse({
                    res, statusCode: 201, message:"There was an error creating new goal tracking task"
                })
            })
        })
        .catch((error)=> {
            console.log("There was an error adding new goal to individual", error)
    
            const serverError = new ServerError();
            return sendFailureResponse({
                res, statusCode: serverError.statusCode, message: serverError.message,
            })
        })
    })
    .catch((error)=> sendServerFailureResponse(res, error))
}