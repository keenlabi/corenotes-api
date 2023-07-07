import { model, Schema, models, Types } from "mongoose"
import { IIndividualDocument } from "./types"
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

const individualSchema = new Schema<IIndividualDocument>({
    active:{
        type:Boolean,
        default:true,
    },
    firstname: {
        type: String,
    },
    middlename: {
        type: String,
    },
    lastname: {
        type:String,
    },
    nickname: {
        type:String,
    },
    dob: {
        type:String,
    },
    gender: {
        type:String,
    },
    maritalStatus: {
        type:String
    },
    religion:{
        type:String
    },
    ssn:{
        type:Number,
        unique:true
    },
    medicaidNumber:{
        type:Number,
        unique:true
    },
    codeAlert:Array<String>,
    weight:{
        type:Number
    },
    contact: {
        name:{
            type:String
        },
        relationship:{
            type:String
        },
        phoneNumber:{
            type:String
        },
    },
    profileImage: {
        type:String,
        default:"https://res.cloudinary.com/the-shawn-exchange/image/upload/v1671833458/user-profile_jsze9h.webp"
    },
    compartment:{
        type:String
    },
    services:Array<{
        serviceId:String,
        startDate:String
    }>,
    diet:Array<String>,
    allergies:{
        food: Array<String>,
        med: Array<String>,
        other: Array<String>
    },
    documents:[{
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
    lastSeen:{
        type:Date,
        default:Date.now
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    
}).plugin(autoIncrementPlugin, {
    model: 'individuals',
    field: 'individualId',
    startAt: 1,
});

export default models.individuals || model<IIndividualDocument>('individuals', individualSchema);

