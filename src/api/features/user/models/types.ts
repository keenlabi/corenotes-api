import { IIndividualDocument } from "@individual/models/types";
import { IStaffDocument } from "@staff/model/types";
import { Document, PopulatedDoc, Types } from "mongoose"

export interface IUserDocument extends Document {
    _id:Types.ObjectId,
    active: boolean,
    accessToken?:string,
    role: string,
    createdAt: Date,
    lastSeen: Date,
    staff:string;
    individual:string;
}