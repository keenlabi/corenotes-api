import { ObjectId } from "mongoose";

export interface ICompartment {
    _id:ObjectId;
    compartmentId:number;
    title:string;
    image:string;
    staffRoles:Array<string>;
    assignedIndividuals:Array<string>;
    meta: {
        bgColor:string,
        labelColor:string
    },
    createdAt:Date;
}