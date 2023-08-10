import { Model, Schema, model, models } from "mongoose";
import { IMedicationDocument } from "./types";
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

export const medicationModel:Model<IMedicationDocument> = models.medications || model<IMedicationDocument>('medications', new Schema({
    active:{
        type:Boolean,
        default:false
    },
    medicationId:{
        type:Number,
        unique:true
    },
    name:{
        type:String,
    },
    strength:{
        type:String,
    },
    route:{
        type:String,
    },
    medType:{
        type:String,
    },
    indications:Array<{
        type:String,
    }>,
    providers:Array<{
        type:String,
    }>,
    pharmarcy:{
        type:String,
    },
    prescriber:{
        type:String,
    },
    instructions:{
        type:String,
    },
    category:{
        enum:['standard', 'controlled', 'psychotropic'],
        type:String,
    },
    amount:{
        current:{
            type:Number,
        },
        startWith:{
            type:Number,
        },
        administered:{
            type:Number,
            default:0
        },
    },
    services:{
        type:Array<String>
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}).plugin(autoIncrementPlugin, {
    model: 'medications',
    field: 'medicationId',
    startAt: 1,
}))