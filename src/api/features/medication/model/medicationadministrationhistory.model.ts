import { Model, Schema, Types, model, models } from "mongoose";
import { IMedicationAdministrationHistoryDocument } from "./types";
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

export const medicationAdministrationHistoryModel:Model<IMedicationAdministrationHistoryDocument> = models.medicationAdministrationHistoryModel || model<IMedicationAdministrationHistoryDocument>('medicationAdministrationHistoryModel', new Schema({
    _id:Types.ObjectId,
    historyId:{
        type:Number,
        unique:true
    },
    individualRef:{ 
        type:Number
    },
    individualMedicationRef:{
        type:String
    },
    medicationId:{
        type:String
    },
    staffRef:{
        type:Number
    },
    title:{
        type:String
    },
    imageURL:{
        type:String
    },
    amountAdministered:{
        type:String
    },
    note:{
        type:String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}).plugin(autoIncrementPlugin, {
    model: 'medicationAdministrationHistoryModel',
    field: 'historyId',
    startAt: 1,
}))