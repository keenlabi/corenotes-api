import { Model, Schema, model, models } from "mongoose";
import { ITaskDocument } from "./types";
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

export const taskModel:Model<ITaskDocument> = models.tasks || model<ITaskDocument>('tasks', new Schema({
    active:{
        type:Boolean,
        default:true
    },
    taskId:{
        type:Boolean,
        unique:true
    },
    status:{
        type:String,
        enum:['TODO', 'COMPLETED', 'DECLINED'],
        default:'TODO'
    },
    taskType:{
        enum:['medication-administration', 'goal-tracking', 'skin-integrity', 'bowel-movement'],
        type:String
    },
    serviceId:{
        type:String,
    },
    individualId:{
        type:String,
    },
    medicationId:{
        type:String
    },
    goalTrackingId:{
        type:String
    },
    skinIntegrity:{
        type:Boolean
    },
    bowelMovement:{
        type:Boolean
    },
    schedule:{
        startAt:{
            type:Date,
        },
        endAt:{
            type:Date,
        }
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}).plugin(autoIncrementPlugin, {
    model: 'tasks',
    field: 'taskId',
    startAt: 1,
}))