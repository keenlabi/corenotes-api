import { model, Schema, models } from "mongoose"
import { IUser } from "./types"

const userSchema = new Schema<IUser>({
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
    }
})

userSchema.virtual('fullname').get(()=> `${userSchema.obj.firstname} ${userSchema.obj.lastname}`)

export default models.users || model<IUser>('users', userSchema);

