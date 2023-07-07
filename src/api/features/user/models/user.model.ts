import { model, Schema, models, Model, Types } from "mongoose"
import { IUserDocument } from "./types"

const userSchema = new Schema<IUserDocument>({
    active:{
        type:Boolean,
        default:true
    },
    accessToken:{
        type:String,
    },
    role:{
        type:String,
        enum:['staff', 'individual']
    },
    lastSeen:{
        type:Date,
        default:Date.now
    },
    staff:{
        type:String
    },
    individual:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export = Model<IUserDocument> =  models.users || model<IUserDocument>('user', userSchema);

