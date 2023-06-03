import { Types } from "mongoose"

export interface IUser {
    id: Types.ObjectId,
    active: boolean,
    // ACCOUNT INFO
    accessToken: String,
    role: String,
    createdAt: Date,
    lastSeen: Date,
    
    // PERSONAL INFORMATION
    firstname: String,
    lastname: String,
    nickname: String,
    initials: String,
    dob:String,
    gender: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    phoneNumber: {
        work: String,
        cell: String,
        other: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phoneNumber: String
    },
    email: String,
    profileImage: String,
    
    // WORK INFORMATION
    compartment: String,
    title: String,
    providerRole: String,
    hiredAt: String,
    username: String,
    employeeId: String,
    jobSchedule: String,
    password: String,

    // DOCUMENTS
    documents:Array<{
        docTitle: String,
        docType: String,
        docDate: string,
        docFileLink: String,
        docFileName: String,
        createdAt: Date
    }>,

    // Individual fields
    middlename:String,
    contact: {
        name:String,
        email:String,
        phoneNumber:String
    },
    religion: String,
    ssn: String,
    weight: Number,
    medicaidNumber: Number,
    maritalStatus: String,
    codeAlert: Array<String>
    requestedServices: Array<{
        service:String,
        startDate:String
    }>,
    diet: Array<String>,
    allergies: {
        food: Array<String>,
        med: Array<String>,
        other: Array<String>
    },
    assessments:Array<{
        _id:Types.ObjectId,
        assessmentId:Types.ObjectId|String,
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