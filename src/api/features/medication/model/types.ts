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
    barcode?:number;
    services:Array<string>;
    createdAt?:Date;
}

export type IMedicationType = ""|"PRN"|"SCHEDULED"

export interface IMedicationAdministrationHistoryDocument {
    _id:Types.ObjectId;
    historyId?:number;
    individualRef:number;
    individualMedicationRef:string;
    medicationId:string;
    staffRef:number;
    title:string;
    imageURL?:string;
    amountAdministered:number
    note:string;
    createdAt?:Date;
}