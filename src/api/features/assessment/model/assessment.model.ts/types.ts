import { Types } from "mongoose"

export interface IAssessmentDocument {
    _id:Types.ObjectId;
    assessmentId:number;
    title:string;
    category:string;
    questions:Array<{
        _id:Types.ObjectId;
        question:string;
        category:string;
    }>,
    assignedTo:string;
    assignees:{
        assigneesType:'ALL'|'SPECIFIC';
        assigneesList:Array<string>;
    };
    createdAt:Date;
}

export interface IAssessmentCategoryDocument {
    _id:Types.ObjectId,
    name:string,
    createdAt:Date
}

export interface IAssessmentQuestionCategoryDocument {
    _id:Types.ObjectId,
    name:String,
    createdAt:Date
}