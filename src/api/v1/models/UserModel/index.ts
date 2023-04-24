import { model, Schema, models, SchemaType } from "mongoose"
import { IUser } from "./types"

const userSchema = new Schema<IUser>({
    email: {
        type: String,
    },
    password: {
        type: String,
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
    }
})

userSchema.virtual('fullname').get(()=> `${userSchema.obj.firstname} ${userSchema.obj.lastname}`)

export default models.users || model<IUser>('users', userSchema);

