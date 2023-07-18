import { Types } from "mongoose";

export interface IMedicationDocument {
    _id:Types.ObjectId;
    medicationId?:number;
    active?:boolean;
    name:string;
    strength:string;
    route:string;
    medType:string;
    indications:Array<string>;
    providers:Array<string>;
    pharmarcy:string;
    prescriber:string;
    instructions:string;
    category:string;
    amount:{
        current:number;
        allocated:number;
        administered:number;
    };
    barCode:number;
    services:Array<string>;
    createdAt?:Date;
}