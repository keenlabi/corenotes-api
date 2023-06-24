import { Schema, models, model, Model } from "mongoose";
import { IVerification } from "./types";

export = Model<IVerification> = models.Verifications || model<IVerification>('Verifications', new Schema<IVerification>({
    email: {
        type:String,
    },
    phone: {
        type:Number
    },
    category: {
        type:String,
        enum: ['EMAIL_VERIFICATION', 'SMS_VERIFICATION'],
    },
    code: {
        type:String,
        unique:true,
    },
    createdAt: {
        type:Date,
        default: Date.now
    }
}));

