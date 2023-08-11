import { ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { individualModel } from "@individual/models/individual.model";
import { Request, Response } from "express";
import { Types } from "mongoose";
import fetchDailyLivingActivityServices from "./fetchDailyLivingActivityServices";
import createDailyLivingActivityTask from "src/api/features/task/services/daily-living-activity/createDailyLivingActivityTask";
import { IIndividualDailyLivingActivityDets } from "src/api/features/task/services/daily-living-activity/makeDailyLivingActivityTask";

export default function addDailyLivingActivityService(req:Request, res:Response) {

    const newDailyActivityData = {
        _id: new Types.ObjectId(),
        title: req.body.title,
        instructions: req.body.instructions,
        schedule: {
            startDate: req.body.schedule.startDate,
            endDate: req.body.schedule.endDate,
            time: req.body.schedule.time,
            frequency: req.body.schedule.frequency,
            frequencyAttr: req.body.schedule.frequencyAttr,
        }
    }
    
    const query = { individualId: parseInt(req.params.individualId) }
    const updateObj = { $push: { dailyLivingActivities: newDailyActivityData } }
    
    individualModel.findOneAndUpdate(query, updateObj, { new: true })
    .then((updatedIndividual)=> {
        fetchDailyLivingActivityServices(updatedIndividual?.individualId!, 1)
        .then((response)=> {

            if(!updatedIndividual) {
                return sendFailureResponse({
                    res,
                    statusCode: 404,
                    message: "Individual not found"
                })
            }

            // create new daily living activity tracking task
            const newGoalTrackingTaskDets:IIndividualDailyLivingActivityDets = {
                individualId: updatedIndividual._id.toString(),
                dailyLivingActivityId: newDailyActivityData._id.toString(),
                schedule: newDailyActivityData.schedule
            }

            createDailyLivingActivityTask(newGoalTrackingTaskDets)
            .then(()=> {
                return sendSuccessResponse({
                    res, statusCode: 201, message:"New daily living activity added successfully", data: response
                })
            })
            .catch((error)=> {
                console.log("There was an error creating new daily living activity tracking task", error)
                return sendFailureResponse({
                    res, statusCode: 201, message:"There was an error creating new daily living activity tracking task"
                })
            })
        })
        .catch((error)=> {
            console.log("There was an error fetching daily living activities list", error)
            return sendFailureResponse({
                res, statusCode: 201, message:"There was an error fetching daily living activities"
            })
        })
    })
    .catch((error)=> {
        console.log("There was an error adding new daily living activity to individual", error)

        const serverError = new ServerError();
        return sendFailureResponse({
            res, statusCode: serverError.statusCode, message: serverError.message,
        })
    })
}