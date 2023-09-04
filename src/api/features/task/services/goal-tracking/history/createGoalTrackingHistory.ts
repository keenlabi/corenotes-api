import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { IIndividualGoaltrackingHistorySubDocument } from "@individual/models/types";
import { Types } from "mongoose";

export interface ICreateGoalTrackingHistory {
    individualId:string;
    goalTrackingId:string;
    timeTaken:number;
    wasGoalMet:string;
    note:string;
}

export default function createGoalTrackingHistory(data:ICreateGoalTrackingHistory) {
    return new Promise((resolve, reject)=> {
        const newGoalTrackingHistory:IIndividualGoaltrackingHistorySubDocument = {
            _id: new Types.ObjectId(),
            timeTakenInMinutes: data.timeTaken,
            wasGoalMet: data.wasGoalMet,
            note: data.note
        }

        const query = { _id: data.individualId, "goalTracking._id": data.goalTrackingId };
        const updateObj = { $push: { "goalTracking.$.history": newGoalTrackingHistory } }

        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual)=> {
            if(!updatedIndividual) {
                const notFoundError = new NotFoundError("Individual not found");
                reject(notFoundError);
            }

            // return newly created history
            const foundGoalMatch = updatedIndividual?.goalTracking.filter(goal => goal._id.toString() === data.goalTrackingId);

            if(!foundGoalMatch?.length) {
                const notFoundError = new NotFoundError("Individual goal tracking not found");
                reject(notFoundError);
            }

            const foundGoalHistoryMatch = foundGoalMatch![0].history.filter(goalTrackingHistory => goalTrackingHistory._id === newGoalTrackingHistory._id);
            
            if(!foundGoalMatch?.length) {
                const notFoundError = new NotFoundError("Individual goal tracking history couldn't be created successfully");
                reject(notFoundError);
            }

            resolve(foundGoalHistoryMatch);
        })
        .catch((error)=> {
            console.log("There was an error storing new goal tracking history in individual goal tracking history")
            console.log(error);
            reject(error)
        })
    })
}