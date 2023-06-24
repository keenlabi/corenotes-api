import { model, Schema, models } from "mongoose"
import { IAssessment, IAssessmentCategory, IAssessmentQuestionCategory } from "./types";

const assessmentSchema = new Schema<IAssessment>({
    title:{ type:String },
    category:{ type:String },
    questions:[{
        question:{ type:String },
        category:{ type:String }
    }],
    assignees:{
        assigneesType:{ 
            type:String,
            enum:['ALL','SPECIFIC']
        },
        assigneesList:[String]
    },
    createdAt: {
        type:Date,
        default: Date.now
    }
})

export const AssessmentModel = models.assessments || model<IAssessment>('assessments', assessmentSchema);

const assessmentCategorySchema = new Schema<IAssessmentCategory>({
    name:{ type:String },
    createdAt: {
        type:Date,
        default: Date.now
    }
})

export const AssessmentCategoryModel = models["assessment-categories"] || model<IAssessment>('assessment-categories', assessmentCategorySchema);

const assessmentQuestionsCategorySchema = new Schema<IAssessmentQuestionCategory>({
    name:{ type:String },
    createdAt: {
        type:Date,
        default: Date.now
    }
})

export const AssessmentQuestionsCategoryModel = models["assessment-question-categories"] || model<IAssessment>('assessment-question-categories', assessmentQuestionsCategorySchema);

