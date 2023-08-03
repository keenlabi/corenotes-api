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
    schedule:{
        startAt:Date;
        endAt:Date;
    },
    createdAt?:Date
}