import { model, Schema, models, Types, Model } from "mongoose"
import { IIndividualDocument } from "./types"
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

const individualSchema = new Schema<IIndividualDocument>({
    individualId: {
        type:Number
    },
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
    services:[{
        _id:Types.ObjectId,
        serviceId:{
            type:String
        },
        schedule:{
            startDate:{
                type:String
            },
            time:{
                type:String
            },
            frequency:{
                type:String
            },
            frequencyAttr:{
                type:String
            }
        },
        createdAt:{
            type:Date,
            default: Date.now
        }
    }],
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
    medications:[{
        _id:Types.ObjectId,
        pharmacy:{
            type:String
        },
        barcode:{
            type:String,
            unique:true,
            uppercase:true
        },
        active:{
            type:Boolean,
            default:true
        },
        medicationId:{
            type:String
        },
        schedule:{
            startDate:{
                type:String
            },
            frequency:{
                type:String
            },
            frequencyAttr:{
                type:Number
            },
            time:{
                type:String
            },
        },
        amount:{
            allocated:{ 
                type:Number 
            },
            current:{ 
                type:Number,
                default:0
            },
            administered:{ 
                type:Number,
                default:0
            }
        },
        supervisoryReviews:[{
            _id:Types.ObjectId,
            monthIndex: { 
                type: Number 
            },
            signedBy:{ 
                type:String
            },
            reviewedAt: {
                type:Date,
                default:Date.now
            }
        }],
        prn:{
            type:Array<String>
        },
        createdAt: {
            type:Date,
            default:Date.now
        }
    }],
    goalTracking:[{
        _id:{
            type: Types.ObjectId
        },
        objective:{
            type:String
        },
        method:{
            type:String
        },
        schedule:{
            startDate:{
                type:String
            },
            endDate:{
                type:String
            },
            time:{
                type:String
            },
            frequency:{
                type:String
            },
            frequencyAttr:{
                type:String
            },
        },
        history:[{
            _id:Types.ObjectId,
            timeTakenInMinutes:{type:Number},
            wasGoalMet:{type:String},
            note:{type:String},
            createdAt:{type:Date},
        }],
        createdAt:{
            type:String
        },
    }],
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

export const individualModel:Model<IIndividualDocument> =  models.individuals || model<IIndividualDocument>('individuals', individualSchema);

