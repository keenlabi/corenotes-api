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
    medications:Array<IIndividualMedication>;
    goalTracking:Array<IIndividualGoaltrackingSubDocument>;
    skinIntegrity:{ history:Array<IIndividualSkinIntegrityHistorySubDocument> };
    bowelMovement:{ history:Array<IIndividualBowelMovementHistorySubDocument> };
    dailyLivingActivities:Array<IIndividualDailyLivingActivitySubDocument>
}

export interface IIndividualDailyLivingActivitySubDocument {
    _id:Types.ObjectId;
    title:string;
    instructions:string;
    schedule:{
        startDate:string;
        endDate:string;
        time:string;
        frequency:string;
        frequencyAttr:number;
    };
    history:Array<IIndividualDailyLivingActivityHistorySubDocument>;
    createdAt:Date;
}

export interface IIndividualDailyLivingActivityHistorySubDocument {
    _id:Types.ObjectId;
    note:string;
    createdAt?:Date;
}

export interface IIndividualBowelMovementHistorySubDocument {
    _id:Types.ObjectId;
    amount:number;
    note:string;
    createdAt?:Date;
}

export interface IIndividualSkinIntegrityHistorySubDocument {
    _id:Types.ObjectId;
    timeTakenInMinutes:number;
    note:string;
    createdAt?:Date;
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
    history:Array<IIndividualGoaltrackingHistorySubDocument>,
    createdAt:Date;
}

export interface IIndividualGoaltrackingHistorySubDocument {
    _id:Types.ObjectId;
    timeTakenInMinutes:number;
    wasGoalMet:string;
    note:string;
    createdAt?:Date;
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