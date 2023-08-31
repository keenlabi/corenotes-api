import { individualModel } from "@individual/models/individual.model"
import { IIndividualBowelMovementHistorySubDocument } from "@individual/models/types";

export default function fetchAllBowelMovementHistory(individualObjId:string) {
    return new Promise<IIndividualBowelMovementHistorySubDocument[]|null>((resolve, reject)=> {
        
        const query = { _id: individualObjId };
        
        individualModel.findOne(query)
        .then((foundIndividual)=> {
            if(!foundIndividual) resolve(null);
            if(!foundIndividual?.bowelMovement.history.length) resolve(null);

            resolve(foundIndividual!.bowelMovement.history)
        })
        .catch((error)=> reject(error));
    })
}