import { Types } from "mongoose"

export interface IUser {
    id: Types.ObjectId,
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
    }>
}