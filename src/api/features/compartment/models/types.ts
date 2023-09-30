import { Document, ObjectId } from "mongoose";

export interface ICompartment extends Document {
    _id:ObjectId;
    compartmentId:number;
    title:string;
    image:string;
    subCompartments:Array<ISubCompartment>;
    meta:{
        bgColor:string;
        labelColor:string;
    };
    createdAt:Date;
}

export interface ISubCompartment extends Document {
    _id:ObjectId;
    title:string;
    description:string;
    services:Array<string>;
    staffRoles:Array<string>;
    individuals:Array<string>;
    createdAt:Date;
}