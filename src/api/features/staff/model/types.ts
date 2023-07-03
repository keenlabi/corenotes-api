import { Types } from "mongoose";

export interface IUser {
    _id:Types.ObjectId;
    active: boolean;
    
    lastSeen:Date;
    createdAt:Date;

    staffId:number;
    
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
}