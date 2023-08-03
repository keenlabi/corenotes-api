import { ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { individualModel } from "@individual/models/individual.model";
import { Request, Response } from "express";
import fetchGoalTrackingServices from "./fetchGoalTrackingServices";
import { Types } from "mongoose";

export default function addGoalTrackingService(req:Request, res:Response) {

    const newGoalData = {
        _id: new Types.ObjectId(),
        objective: req.body.objective,
        method: req.body.method,
        schedule: {
            startDate: req.body.schedule.startDate,
            endDate: req.body.schedule.endDate,
            time: req.body.schedule.time,
            frequency: req.body.schedule.frequency,
            frequencyAttr: req.body.schedule.frequencyAttr,
        }
    }
    
    const query = { individualId: parseInt(req.params.individualId) }
    const updateObj = { $push: { goalTracking: newGoalData } }
    
    individualModel.findOneAndUpdate(query, updateObj, { new: true })
    .then((updatedIndividual)=> {
        fetchGoalTrackingServices(updatedIndividual?.individualId!, 1)
        .then((response)=> {
            return sendSuccessResponse({
                res, statusCode: 201, message:"New goal added successfully", data: response
            })
        })
        .catch((error)=> {
            console.log("There was an error fetching goals list", error)
            return sendFailureResponse({
                res, statusCode: 201, message:"There was an error fetching goals"
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
}