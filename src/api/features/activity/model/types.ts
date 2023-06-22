import { Types } from "mongoose"

export interface IActivity {
    id: Types.ObjectId,
    title:String,
    dateTime: {
        startDateTime: Date,
        endDateTime: Date
    },
    host:String,
    assignees: Array<String>,
    category: String,
    status: String,
    createdAt: Date
}