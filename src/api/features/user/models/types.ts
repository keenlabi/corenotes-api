import { Types } from "mongoose"

export interface IUser {
    _id:Types.ObjectId,
    active: boolean,
    // ACCOUNT INFO
    accessToken: string,
    role: string,
    createdAt: Date,
    lastSeen: Date,
    
    // PERSONAL INFORMATION
    firstname: string,
    lastname: string,
    nickname: string,
    initials: string,
    dob:string,
    gender: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phoneNumber: {
        work: string,
        cell: string,
        other: string
    },
    emergencyContact: {
        name: string,
        relationship: string,
        phoneNumber: string
    },
    email: string,
    profileImage: string,
    
    // WORK INFORMATION
    compartment: string,
    title: string,
    providerRole: string,
    hiredAt: string,
    username: string,
    employeeId: string,
    jobSchedule: string,
    password: string,

    // DOCUMENTS
    documents:Array<{
        docTitle: string,
        docType: string,
        docDate: string,
        docFileLink: string,
        docFileName: string,
        createdAt: Date
    }>,

    // Individual fields
    middlename:string,
    contact: {
        name:string,
        email:string,
        phoneNumber:string
    },
    religion: string,
    ssn: string,
    weight: Number,
    medicaidNumber: Number,
    maritalStatus: string,
    codeAlert: Array<string>
    requestedServices: Array<{
        service:string,
        startDate:string
    }>,
    diet: Array<string>,
    allergies: {
        food: Array<string>,
        med: Array<string>,
        other: Array<string>
    },
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
    }>
}