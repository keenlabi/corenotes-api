import { model, Schema, models, Types, Model } from "mongoose"
import { IIndividualBloodGlucoseCheckHistoryDocument } from "./types"
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

const individualBloodGlucoseCheckHistorySchema = new Schema<IIndividualBloodGlucoseCheckHistoryDocument>({
    _id:Types.ObjectId,
    historyId:{ type: Number },
    note:{ type: String },
    individualId:{ type: String },
    staffId:{ type: String },
    createdAt:{ 
        type: Date,
        default: Date.now
    }
    
}).plugin(autoIncrementPlugin, {
    model: 'individuals-blood-glucose-check-history',
    field: 'historyId',
    startAt: 1,
});

export const individualBloodGlucoseCheckHistoryModel:Model<IIndividualBloodGlucoseCheckHistoryDocument> =  models["individuals-blood-glucose-check-history"] || model<IIndividualBloodGlucoseCheckHistoryDocument>("individuals-blood-glucose-check-history", individualBloodGlucoseCheckHistorySchema);

