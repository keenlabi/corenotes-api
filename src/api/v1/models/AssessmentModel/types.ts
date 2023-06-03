import { Types } from "mongoose"

export interface IAssessment {
    _id:Types.ObjectId|String,
    title:String,
    category:String,
    questions:Array<{
        question:String,
        category:String
    }>,
    assignees:{
        assigneesType:'ALL'|'SPECIFIC',
        assigneesList:Array<String>
    }
    createdAt:Date
}

export interface IAssessmentCategory {
    _id:Types.ObjectId,
    name:String,
    createdAt:Date
}

export interface IAssessmentQuestionCategory {
    _id:Types.ObjectId,
    name:String,
    createdAt:Date
}