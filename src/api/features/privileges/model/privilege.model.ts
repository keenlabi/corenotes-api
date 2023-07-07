import { Model, Schema, model, models } from "mongoose";
import { IPrivilegeDocument } from "./types";
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

export = Model<IPrivilegeDocument> = models.privileges || model<IPrivilegeDocument>('privileges', new Schema({
    privilegeId:{
        type:Number
    },  
    title:{
        required:true,
        type:String,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

}).plugin(autoIncrementPlugin, {
    model: 'privileges',
    field: 'privilegeId',
    startAt: 1,
}));