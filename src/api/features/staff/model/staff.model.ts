import { model, Schema, models } from "mongoose"
import { IUser } from "./types"
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

const staffSchema = new Schema<IUser>({
    staffId: {
        type:Number
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
    password: {
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
        unique: true
    },
    profileImage: {
        type: String,
        default: "https://res.cloudinary.com/the-shawn-exchange/image/upload/v1671833458/user-profile_jsze9h.webp"
    },
    jobSchedule: {
        type: String,
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
    maritalStatus: {
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}).plugin(autoIncrementPlugin, {
    model: 'staffs',
    field: 'staffId',
    startAt: 1,
});

export default models.staffs || model<IUser>('staffs', staffSchema);

