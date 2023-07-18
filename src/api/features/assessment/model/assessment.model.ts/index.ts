import { model, Schema, models, Model } from "mongoose"
import { IAssessmentCategoryDocument, IAssessmentDocument, IAssessmentQuestionCategoryDocument } from "./types";
import autoIncrementPlugin from "src/config/database/autoIncrementInit";

const assessmentSchema = new Schema<IAssessmentDocument>({
    assessmentId:{
        type:Number
    },
    title:{ type:String },
    category:{ type:String },
    questions:[{
        question:{ type:String },
        category:{ type:String }
    }],
    assignedTo:{ type:String },
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
}).plugin(autoIncrementPlugin, {
    model: 'assessments',
    field: 'assessmentId',
    startAt: 1,
})

export const assessmentModel:Model<IAssessmentDocument> = models.assessments || model<IAssessmentDocument>('assessments', assessmentSchema);

const assessmentCategorySchema = new Schema<IAssessmentCategoryDocument>({
    name:{ type:String },
    createdAt: {
        type:Date,
        default: Date.now
    }
})

export const AssessmentCategoryModel = models["assessment-categories"] || model<IAssessmentCategoryDocument>('assessment-categories', assessmentCategorySchema);

const assessmentQuestionsCategorySchema = new Schema<IAssessmentQuestionCategoryDocument>({
    name:{ type:String },
    createdAt: {
        type:Date,
        default: Date.now
    }
})

export const AssessmentQuestionsCategoryModel = models["assessment-question-categories"] || model<IAssessmentQuestionCategoryDocument>('assessment-question-categories', assessmentQuestionsCategorySchema);

