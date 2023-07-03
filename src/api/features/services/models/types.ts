import { ObjectId } from "mongoose";

export interface IService {
    _id:ObjectId;
    serviceId:number;
    title:string;
    category:string;
    compartments:Array<string>;
    staffRoles:Array<string>;
    assignedIndividuals:Array<string>;
    createdAt:Date
}