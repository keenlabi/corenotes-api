import { model, Schema, models } from "mongoose"
import { IActivity } from "./types"

const activitySchema = new Schema<IActivity>({
    title:{
        type:String
    },
    dateTime: {
        startDateTime: {
            type:Date
        },
        endDateTime: {
            type:Date
        }
    },
    host:{
        type:String
    },
    category: {
        type:String,
        enum:['MEETING', 'TRAINING']
    },
    status: {
        type:String,
        enum:['UPCOMING', 'COMPLETED', 'LIVE']
    },
    assignees: {
        type:[String]
    },
    createdAt: {
        type:Date
    }
})

export default models.activities || model<IActivity>('activities', activitySchema);

