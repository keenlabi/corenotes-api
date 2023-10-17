import { Model, Schema, Types, model, models } from "mongoose";
import { ICompartment } from "./types";
import autoIncrementPlugin from "src/config/database/autoIncrementInit"

const compartmentModel:Model<ICompartment> = models.compartments || model<ICompartment>('compartments', new Schema<ICompartment>({
    _id:Types.ObjectId,
    compartmentId:{ type:Number },
    title:{ type:String },
    image:{ type:String },
    subCompartments:[{
        title:{ type:String },
        description:{ type:String },
        services:[String],
        staffRoles:[String],
        individuals:[String],
        createdAt:{ 
            type:Date,
            default:Date.now
        },
    }],
    meta: {
        bgColor: { type:String },
        labelColor: { type:String }
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
}).plugin(autoIncrementPlugin, {
    model: 'compartments',
    field: 'compartmentId',
    startAt: 1,
}));

export default compartmentModel;