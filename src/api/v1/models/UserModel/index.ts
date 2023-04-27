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
    accessToken: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    role: {
        type: String,
        enum: ["STAFF", "INDIVIDUAL"],
        default: "INDIVIDUAL"
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

