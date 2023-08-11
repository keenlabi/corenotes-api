import { NotFoundError } from "@globals/server/Error";
import { individualBloodGlucoseCheckHistoryModel } from "@individual/models/individual-blood-glucose-check-history.model";
import { IIndividualBloodGlucoseCheckHistoryDocument } from "@individual/models/types";
import { Types } from "mongoose";

export interface ICreateBloodGlucoseCheckHistory {
    individualId:string;
    staffId:string;
    note:string;
}

export default function createBloodGlucoseCheckHistory(data:ICreateBloodGlucoseCheckHistory) {
    return new Promise<IIndividualBloodGlucoseCheckHistoryDocument>((resolve, reject)=> {
        
        const newBloodGlucoseCheckHistory:IIndividualBloodGlucoseCheckHistoryDocument = {
            _id: new Types.ObjectId(),
            individualId: data.individualId,
            staffId: data.staffId,
            note: data.note,
        }

        individualBloodGlucoseCheckHistoryModel.create(newBloodGlucoseCheckHistory)
        .then((createdHistory)=> {
            if(!createdHistory) {
                const notFoundError = new NotFoundError("Individual not found");
                reject(notFoundError);
            }
            
            if(!createdHistory) {
                const notFoundError = new NotFoundError("Individual shift notes history couldn't be created successfully");
                reject(notFoundError);
            }

            resolve(createdHistory);
        })
        .catch((error)=> {
            console.log("There was an error storing new shift notes history in individual shift notes history")
            console.log(error);
            reject(error)
        })
    })
}