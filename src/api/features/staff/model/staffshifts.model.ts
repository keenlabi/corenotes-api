import { Model, Schema, Types, model, models } from "mongoose";
import { IStaffShift } from "./types";

const staffShiftsModel:Model<IStaffShift> = models.staffShifts || model('staffShifts', new Schema<IStaffShift>({
    _id:Types.ObjectId,
    staffRef:{ type:String },
    schedule: {
        date:{ type:String },
        startTime:{ type:String },
        endTime:{ type:String },
    }

}, { timestamps:{} }))

export default staffShiftsModel;