import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { IIndividualSkinIntegrityHistorySubDocument } from "@individual/models/types";
import { Types } from "mongoose";

export interface ICreateSkinIntegrityHistory {
    individualId:string;
    timeTaken:number;
    note:string;
}

export default function createSkinIntegrityHistory(data:ICreateSkinIntegrityHistory) {
    return new Promise((resolve, reject)=> {
        
        const newSkinIntegrityHistory:IIndividualSkinIntegrityHistorySubDocument = {
            _id: new Types.ObjectId(),
            timeTakenInMinutes: data.timeTaken,
            note: data.note
        }

        const query = { _id: data.individualId };
        const updateObj = { $push: { "skinIntegrity.history": newSkinIntegrityHistory } }

        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual)=> {
            if(!updatedIndividual) {
                const notFoundError = new NotFoundError("Individual not found");
                reject(notFoundError);
            }

            const foundSkinIntegrityHistoryMatch = updatedIndividual?.skinIntegrity.history.filter(skinIntegrityHistory => skinIntegrityHistory._id === newSkinIntegrityHistory._id);
            
            if(!foundSkinIntegrityHistoryMatch?.length) {
                const notFoundError = new NotFoundError("Individual goal tracking history couldn't be created successfully");
                reject(notFoundError);
            }

            resolve(foundSkinIntegrityHistoryMatch);
        })
        .catch((error)=> {
            console.log("There was an error storing new goal tracking history in individual goal tracking history")
            console.log(error);
            reject(error)
        })
    })
}