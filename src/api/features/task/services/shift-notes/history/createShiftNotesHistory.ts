import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { IIndividualShiftNotesHistorySubDocument } from "@individual/models/types";
import { Types } from "mongoose";

export interface ICreateShiftNotesHistory {
    individualId:string;
    staffId:string;
    note:string;
}

export default function createShiftNotesHistory(data:ICreateShiftNotesHistory) {
    return new Promise((resolve, reject)=> {
        
        const newShiftNotesHistory:IIndividualShiftNotesHistorySubDocument = {
            _id: new Types.ObjectId(),
            staffId: data.staffId,
            note: data.note
        }

        const query = { _id: data.individualId };
        const updateObj = { $push: { "shiftNotes.history": newShiftNotesHistory } }


        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual)=> {
            if(!updatedIndividual) {
                const notFoundError = new NotFoundError("Individual not found");
                reject(notFoundError);
            }

            const foundShiftNotesHistoryMatch = updatedIndividual?.shiftNotes.history.filter(bowelMovementHistory => bowelMovementHistory._id.toString() === newShiftNotesHistory._id.toString());
            
            if(!foundShiftNotesHistoryMatch?.length) {
                const notFoundError = new NotFoundError("Individual shift notes history couldn't be created successfully");
                reject(notFoundError);
            }

            resolve(foundShiftNotesHistoryMatch);
        })
        .catch((error)=> {
            console.log("There was an error storing new shift notes history in individual shift notes history")
            console.log(error);
            reject(error)
        })
    })
}