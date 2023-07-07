import { Types } from "mongoose";

export interface IPrivilegeDocument extends Document {
    _id:Types.ObjectId;
    privilegeId:number;
    title:string;
    createdAt:string;
}