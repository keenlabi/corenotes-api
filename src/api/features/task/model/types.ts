import { Types } from "mongoose";

export interface ITaskDocument {
    _id:Types.ObjectId;
    active:boolean;
    taskId:number;
    status:string;
    taskType:string;
    serviceId:string;
    individualId:string;
    medicationId?:string;
    goalTrackingId?:string;
    skinIntegrity?:boolean;
    bowelMovement?:boolean;
    shiftNotes?:{
        type:Boolean
    },
    bloodGlucoseCheck:{
        type:Boolean
    },
    schedule:{
        startAt:Date;
        endAt:Date;
    },
    dailyLivingActivityId?:string;
    createdAt?:Date
}