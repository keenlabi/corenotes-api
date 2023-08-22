import { model, Schema, models, Types, Model } from "mongoose"
import autoIncrementPlugin from "src/config/database/autoIncrementInit";
import { IIndividualBehaviorServiceDocument } from "./types";
import serviceScheduleSchema from "src/api/shared/schema/schedule.schema";

const individualBehaviorServiceSchema = new Schema<IIndividualBehaviorServiceDocument>({
    _id:Types.ObjectId,
    individualBehaviorId:{
        type:Number
    },
    individualId:{
        type:String,
    },
    description:{
        type:String,
    },
    goals:Array<String>,
    schedule:serviceScheduleSchema,
    createdAt:{ 
        type: Date,
        default: Date.now
    }
    
}).plugin(autoIncrementPlugin, {
    model: 'individual-behavior-service',
    field: 'individualBehaviorId',
    startAt: 1,
});

export const individualBehaviorServiceModel:Model<IIndividualBehaviorServiceDocument> =  models["individual-behavior-service"] || model<IIndividualBehaviorServiceDocument>("individual-behavior-service", individualBehaviorServiceSchema);

