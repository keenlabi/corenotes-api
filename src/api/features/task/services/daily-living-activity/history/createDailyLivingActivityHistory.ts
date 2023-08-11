import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { IIndividualDailyLivingActivityHistorySubDocument } from "@individual/models/types";
import { Types } from "mongoose";

export interface ICreateDailyLivingActivityHistory {
    individualId:string;
    dailyLivingActivityId:string;
    note:string;
}

export default function createDailyLivingActivityHistory(data:ICreateDailyLivingActivityHistory) {
    return new Promise((resolve, reject)=> {
        const newDailyLivingActivityHistory:IIndividualDailyLivingActivityHistorySubDocument = {
            _id: new Types.ObjectId(),
            note: data.note,
        }

        const query = { _id: data.individualId, "dailyLivingActivities._id": data.dailyLivingActivityId };
        const updateObj = { $push: { "dailyLivingActivities.$.history": newDailyLivingActivityHistory } }

        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual)=> {
            if(!updatedIndividual) {
                const notFoundError = new NotFoundError("Individual not found");
                reject(notFoundError);
            }

            // return newly created history
            const foundDailyLivingActivitiesMatch = updatedIndividual?.dailyLivingActivities.filter(goal => goal._id.toString() === data.dailyLivingActivityId);

            if(!foundDailyLivingActivitiesMatch?.length) {
                const notFoundError = new NotFoundError("Individual daily living activity not found");
                reject(notFoundError);
            }

            const foundDailyLivingActivityMatch = foundDailyLivingActivitiesMatch![0].history.filter(goalTrackingHistory => goalTrackingHistory._id === newDailyLivingActivityHistory._id);
            
            if(!foundDailyLivingActivitiesMatch?.length) {
                const notFoundError = new NotFoundError("Individual daily living activity history couldn't be created successfully");
                reject(notFoundError);
            }

            resolve(foundDailyLivingActivityMatch);
        })
        .catch((error)=> {
            console.log("There was an error storing new daily living activity history in individual daily living activity history")
            console.log(error);
            reject(error)
        })
    })
}