import { model, Schema, models, Model, Types } from "mongoose"
import { IStaffDocument } from "./types"
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

const staffSchema = new Schema<IStaffDocument>({
    active:{
        type:Boolean,
        default:true
    },
    staffId: {
        type:Number
    },
    password: {
        type:String,
    },
    accessToken:{
        type:String,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
        unique: true
    },
    clockedIn:{
        type:Boolean,
        default:false
    },
    lastClockInTime: {
        type: Date,
        default:Date.now
    },
    lastClockOutTime: {
        type: Date,
        default:Date.now
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
    title: {
        type: String,
    },
    providerRole: {
        type: String,
    },
    hiredAt:{
        type:String,
    },
    employeeId:{
        type:String
    },
    profileImage:{
        type:String,
        default:"https://res.cloudinary.com/the-shawn-exchange/image/upload/v1671833458/user-profile_jsze9h.webp"
    },
    jobSchedule: {
        type: String,
    },
    documents: [{
        docTitle:{
            type:String
        },
        docType:{
            type:String
        },
        docDate:{
            type:String
        },
        docFileLink:String,
        docFileName:String,
        createdAt:{
            type:Date,
            default:Date.now,
        }
    }],
    maritalStatus:{
        type:String
    },
    lastSeen:{
        type:Date,
        default:Date.now
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    isClockedIn:{ 
        type:Boolean, 
        default:false 
    }
    
}, { timestamps:{} })
.plugin(autoIncrementPlugin, {
    model: 'staffs',
    field: 'staffId',
    startAt: 1,
});

export = Model<IStaffDocument> = models.staffs || model<IStaffDocument>('staff', staffSchema);

