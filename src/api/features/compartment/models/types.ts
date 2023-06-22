import { ObjectId } from "mongoose";

export interface ICompartment {
    _id:ObjectId;
    compartmentId:number;
    title:string;
    image:String,
    staffRoles:Array<string>;
    assignedIndividuals:Array<string>;
    createdAt:Date
}