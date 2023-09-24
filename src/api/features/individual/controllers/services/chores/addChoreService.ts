import { Types } from "mongoose";
import { ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendNotFoundFailureResponse, sendServerFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { Request, Response } from "express";
import { individualChoreServiceModel } from "@individual/models/individual-chore-service.model";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service";
import fetchChoreServices from "./fetchChoreServices";
import createChoreTask from "src/api/features/task/services/chores/createChoreTask";
import { IIMakeChoreTaskDets } from "src/api/features/task/services/chores/makeChoreTask";

export default function addChoreService(req:Request, res:Response) {

    const newIndividualChoreData = {
        _id: new Types.ObjectId(),
        individualId:"",
        description: req.body.description,
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

        newIndividualChoreData.individualId = foundIndividual._id.toString();

        individualChoreServiceModel.create(newIndividualChoreData)
        .then((createdIndividualChore)=> {

            const newTaskData:IIMakeChoreTaskDets = {
                individualId: newIndividualChoreData.individualId,
                choreId: createdIndividualChore._id.toString(),
                schedule: {
                    startDate: createdIndividualChore.schedule.startDate,
                    frequency: createdIndividualChore.schedule.frequency,
                    frequencyAttr: createdIndividualChore.schedule.frequencyAttr,
                    time: createdIndividualChore.schedule.time[0],
                }
            }

            createChoreTask(newTaskData)
            .then(()=> {
                fetchChoreServices(foundIndividual?.individualId!, 1)
                .then((foundIndividualChores)=> {
                    return sendSuccessResponse({
                        res, 
                        statusCode: 201, 
                        message:"New individual chore added successfully", 
                        data: foundIndividualChores
                    })
                })
                .catch((error)=> {
                    console.log("There was an error fetching goals list", error)
                    return sendFailureResponse({
                        res, statusCode: 201, message:"There was an error fetching individual chore"
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