import { Document, ObjectId } from "mongoose"

export interface IVerification extends Document {
    _id:ObjectId;
    email?:string,
    phone?:number,
    category:string,
    code:string,
    createdAt:Date,
}