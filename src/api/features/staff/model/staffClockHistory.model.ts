import { Model, Schema, Types, model, models } from "mongoose";
import { IStaffClockHistory } from "./types";

const staffClockHistoryModel:Model<IStaffClockHistory> = models.staffClockHistory || model('staffClockHistory', new Schema<IStaffClockHistory>({
    _id:Types.ObjectId,
    staffRef:{ type:String },
    createdAt:{
        type:Date,
        default: Date.now
    }
}))

export default staffClockHistoryModel;