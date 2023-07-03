import { Schema, Types, model, models } from "mongoose";
import { IStaffRole } from "./types";

export default models.staffRole || model('staffRole', new Schema<IStaffRole>({
    title: {
        type:String
    }
}))