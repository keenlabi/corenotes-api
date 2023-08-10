import { Model, Schema, model, models } from "mongoose";
import autoIncrementPlugin from "src/config/database/autoIncrementInit";
import { IService } from "./types";

export = Model<IService> = models.services || model<IService>('services', new Schema<IService>({
    serviceId:{ 
        type:Number,
        unique:true
    },
    title:{ 
        type:String,
        unique:true
    },
    refName:{
        type:String,
        unique:true
    },
    category: {
        type:String,
        enum:['requested','provided'],
    },
    compartments:[String],
    staffRoles:[String],
    assignedIndividuals:[String],
    medications:Array<String>,
    createdAt:{
        type:Date,
        default:Date.now
    }

}).plugin(autoIncrementPlugin, {
    model: 'service',
    field: 'serviceId',
    startAt: 1,
}));