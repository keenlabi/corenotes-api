import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { IIndividualBowelMovementHistorySubDocument } from "@individual/models/types";
import { Types } from "mongoose";

export interface ICreateBowelMovementHistory {
    individualId:string;
    amount:number;
    note:string;
}

export default function createBowelMovementHistory(data:ICreateBowelMovementHistory) {
    return new Promise((resolve, reject)=> {
        
        const newBowelMovementHistory:IIndividualBowelMovementHistorySubDocument= {
            _id: new Types.ObjectId(),
            amount: data.amount,
            note: data.note,
        }

        const query = { _id: data.individualId };
        const updateObj = { $push: { "bowelMovement.history": newBowelMovementHistory } }


        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual)=> {
            if(!updatedIndividual) {
                const notFoundError = new NotFoundError("Individual not found");
                reject(notFoundError);
            }

            const foundBowelMovementHistoryMatch = updatedIndividual?.bowelMovement.history.filter(bowelMovementHistory => bowelMovementHistory._id.toString() === newBowelMovementHistory._id.toString());
            
            if(!foundBowelMovementHistoryMatch?.length) {
                const notFoundError = new NotFoundError("Individual bowel movement history couldn't be created successfully");
                reject(notFoundError);
            }

            resolve(foundBowelMovementHistoryMatch);
        })
        .catch((error)=> {
            console.log("There was an error storing new bowel movement history in individual bowel movement history")
            console.log(error);
            reject(error)
        })
    })
}