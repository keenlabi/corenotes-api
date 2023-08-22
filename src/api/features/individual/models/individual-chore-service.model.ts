import { model, Schema, models, Types, Model } from "mongoose"
import autoIncrementPlugin from "src/config/database/autoIncrementInit";
import serviceScheduleSchema from "src/api/shared/schema/schedule.schema";
import { IIndividualChoreServiceDocument } from "./types";

const individualChoreServiceSchema = new Schema<IIndividualChoreServiceDocument>({
    _id:Types.ObjectId,
    individualChoreId:{
        type:Number
    },
    individualId:{
        type:String,
    },
    title:String,
    description:{ type:String },
    schedule:serviceScheduleSchema,
    createdAt:{ 
        type: Date,
        default: Date.now
    }
    
}).plugin(autoIncrementPlugin, {
    model: 'individual-chore-service',
    field: 'individualChoreId',
    startAt: 1,
});

export const individualChoreServiceModel:Model<IIndividualChoreServiceDocument> =  models["individual-chore-service"] || model<IIndividualChoreServiceDocument>("individual-chore-service", individualChoreServiceSchema);

