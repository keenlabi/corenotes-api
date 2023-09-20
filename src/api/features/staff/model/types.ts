import { Document, PopulatedDoc, Types } from "mongoose";

export interface IStaffDocument extends Document {
    _id:Types.ObjectId;
    active: boolean;
    lastSeen:Date;
    createdAt:Date;
    staffId:number;
    accessToken:string;

    // PERSONAL INFORMATION
    firstname: string;
    lastname: string;
    nickname: string;
    initials: string;
    dob:string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: {
        work: string;
        cell: string;
        other: string
    };
    emergencyContact: {
        name: string;
        relationship: string;
        phoneNumber: string
    };
    email: string;
    profileImage: string;
    
    // WORK INFORMATION
    title:string;
    providerRole:string;
    hiredAt:string;
    username:string;
    employeeId:string;
    jobSchedule:string;
    password:string;

    // DOCUMENTS
    documents:Array<{
        _id:Types.ObjectId;
        docTitle: string;
        docType: string;
        docDate: string;
        docFileLink: string;
        docFileName: string;
        createdAt: Date
    }>;
    maritalStatus: string;
}

export interface IStaffRole {
    _id:Types.ObjectId;
    title:string;
    privileges:{
        staff_profile_view:boolean;
        staff_registration:boolean;
        staff_document_upload:boolean;
    }
}