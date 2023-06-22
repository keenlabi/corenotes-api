import { model, Schema, models } from "mongoose"
import { IUser } from "./types"

const userSchema = new Schema<IUser>({
    active: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
    },
    username: {
        type: String
    },
    password: {
        type: String,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    nickname: {
        type: String,
    },
    initials: {
        type: String,
    },
    dob: {
        type: String,
    },
    gender: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: String
    },
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
    compartment: {
        type: String,
    },
    title: {
        type: String,
    },
    providerRole: {
        type: String,
    },
    hiredAt: {
        type: String,
    },
    employeeId: {
        type: String,
    },
    jobSchedule: {
        type: String,
    },
    role: {
        type: String,
        enum: ["STAFF", "INDIVIDUAL"],
        default: "INDIVIDUAL"
    },
    profileImage: {
        type: String,
        default: "https://res.cloudinary.com/the-shawn-exchange/image/upload/v1671833458/user-profile_jsze9h.webp"
    },
    accessToken: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastSeen: {
        type: Date
    },
    documents: [{
        docTitle: {
            type: String
        },
        docType: {
            type: String
        },
        docDate: {
            type: String
        },
        docFileLink: String,
        docFileName: String,
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    middlename: {
        type:String
    },
    contact: {
        name:{
            type:String
        },
        email:{
            type:String
        },
        phoneNumber:{
            type:String
        }
    },
    religion: {
        type:String
    },
    ssn: {
        type:String
    },
    weight: {
        type:Number
    },
    medicaidNumber: {
        type:Number
    },
    maritalStatus: {
        type:String
    },
    codeAlert: {
        type: [String]
    },
    requestedServices: [{
        service:String,
        startDate:String
    }],
    diet: [String],
    allergies: {
        food: [String],
        med: [String],
        other: [String]
    },
    assessments: [{
        assessmentId: {
            type:String,
        },
        status: {
            enum: ['PENDING', 'IN-PROGRESS', 'COMPLETED'],
            type:String
        },
        questions:[{
            question:{ type: String },
            answer:{ 
                enum:['YES','NO'],
                type:String
            },
            comment:{ type: String }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})

export default models.users || model<IUser>('users', userSchema);

