import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { IIndividualGoaltrackingSubDocument } from "@individual/models/types";

export default function getIndividualGoalDetailsByPairObjectId(individualId:string, goalTrackingId:string) {
    return new Promise<IIndividualGoaltrackingSubDocument|null>((resolve, reject)=> {
        
        const query = { _id: individualId, "goalTracking._id": goalTrackingId }
    
        individualModel.findOne(query)
        .then((foundIndividual)=> {
            if(!foundIndividual) {
                resolve(foundIndividual)
            }

            const foundGoalTrackingMatch = foundIndividual?.goalTracking.filter(goalTracking => goalTracking._id.toString() === goalTrackingId);
            if(!foundGoalTrackingMatch?.length) resolve(null);
            
            resolve(foundGoalTrackingMatch![0]);
        })
        .catch((error)=> reject(error))
    })
}