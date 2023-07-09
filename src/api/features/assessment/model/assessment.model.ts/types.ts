import { Types } from "mongoose"

export interface IAssessmentDocument {
    _id:Types.ObjectId|String,
    title:String,
    category:String,
    questions:Array<{
        question:String,
        category:String
    }>,
    assignedTo:string;
    assignees:{
        assigneesType:'ALL'|'SPECIFIC',
        assigneesList:Array<String>
    };
    createdAt:Date
}

export interface IAssessmentCategoryDocument {
    _id:Types.ObjectId,
    name:String,
    createdAt:Date
}

export interface IAssessmentQuestionCategoryDocument {
    _id:Types.ObjectId,
    name:String,
    createdAt:Date
}