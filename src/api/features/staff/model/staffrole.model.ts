import { Schema, Types, model, models } from "mongoose";
import { IStaffRole } from "./types";

export default models.staffRole || model('staffRole', new Schema<IStaffRole>({
    title: {
        type:String
    },
    privileges:{
        staff_profile_view:{
            type:Boolean,
        },
        staff_registration:{
            type:Boolean,
        },
        staff_document_upload:{
            type:Boolean,
        },
    }
}))