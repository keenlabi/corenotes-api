import { Types } from "mongoose"

export interface IIndividualDocument {
    _id:Types.ObjectId,
    active:boolean,

    lastSeen:Date;
    createdAt:Date;
    
    individualId:number;

    // PERSONAL INFORMATION
    firstname:string,
    middlename:string,
    lastname:string,
    nickname:string,
    dob:string,
    gender:string,
    maritalStatus:string,
    religion:string,
    ssn:number,
    medicaidNumber:number,
    codeAlert: Array<string>
    weight:number,
    contact: {
        name:string,
        email:string,
        phoneNumber:string
    },
    profileImage:string,

    // HEALTH INFORMATION
    compartment:string;
    services: Array<IIndividualServicesSubDocument>,
    diet: Array<string>,
    allergies: {
        food: Array<string>,
        med: Array<string>,
        other: Array<string>
    },

    documents:Array<{
        docTitle: string,
        docType: string,
        docDate: string,
        docFileLink: string,
        docFileName: string,
        createdAt: Date
    }>,
    assessments:Array<{
        _id:Types.ObjectId,
        assessmentId:Types.ObjectId|string,
        status:'PENDING'|'IN-PROGRESS'|'COMPLETED',
        questions:Array<{
            _id:Types.ObjectId,
            question:string,
            answer:'YES'|'NO',
            comment:string
        }>,
        createdAt:Date
    }>,
    medications:Array<IIndividualMedication>,
    goalTracking:Array<IIndividualGoaltrackingSubDocument>
}

export interface IIndividualGoaltrackingSubDocument {
    _id:Types.ObjectId;
    objective:string;
    method:string;
    schedule:{
        startDate:string;
        endDate:string;
        time:string;
        frequency:string;
        frequencyAttr:number;
    },
    createdAt:Date;
}

export interface IIndividualServicesSubDocument {
    _id:Types.ObjectId,
    serviceId:string,
    schedule: {
        startDate:string;
        time:string;
        frequency:string;
        frequencyAttr:number;
    },
    createdAt:Date
}

export interface IIndividualMedication {
    _id:Types.ObjectId;
    barcode:string;
    active:boolean;
    medicationId:string;
    pharmacy:string;
    schedule:{
        startDate:string;
        frequency:string;
        frequencyAttr:number;
        time:string;
    };
    amount:{
        allocated:number;
        current:number;
        administered:number;
    },
    supervisoryReviews:Array<{
        _id:Types.ObjectId;
        monthIndex:number;
        signedBy:string;
        createdAt:Date;
    }>,
    prn:Array<string>;
    createdAt:Date;
}