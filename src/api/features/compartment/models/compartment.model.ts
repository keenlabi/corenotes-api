import { Model, Schema, model, models } from "mongoose";
import { ICompartment } from "./types";
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

export = Model<ICompartment> = models.compartments || model<ICompartment>('compartments', new Schema<ICompartment>({
    compartmentId:{ type:Number },
    title:{ type:String },
    image:{ type:String }, 
    staffRoles:[String],
    assignedIndividuals:[String],
    createdAt:{
        type:Date,
        default:Date.now
    }
}).plugin(autoIncrementPlugin, {
    model: 'compartments',
    field: 'compartmentId',
    startAt: 1,
}));