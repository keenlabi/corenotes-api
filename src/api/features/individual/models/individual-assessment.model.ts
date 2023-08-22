import { model, Schema, models, Types, Model } from "mongoose"
import autoIncrementPlugin from "src/config/database/autoIncrementInit";
import { IIndividualAssessmentDocument } from "./types";

const individualAssessmentSchema = new Schema<IIndividualAssessmentDocument>({
    _id:Types.ObjectId,
    sessionId:{
        type:Number
    },
    assessmentId:{ type: String },
    individualId:{ type: String },
    status:{ 
        type:String,
        enum:["PENDING", "IN-PROGRESS", "COMPLETED"],
        default:"PENDING"
    },
    questions:Array<{
        _id:Types.ObjectId,
        question:{ type:String },
        answer:{
            type:{ type:String },
            enum:["", "YES", "NO"]
        },
        comment:{ type:String },
    }>,
    createdAt:{ 
        type: Date,
        default: Date.now
    }
    
}).plugin(autoIncrementPlugin, {
    model: 'individual-assessments',
    field: 'sessionId',
    startAt: 1,
});

export const individualAssessmentModel:Model<IIndividualAssessmentDocument> =  models["individual-assessments"] || model<IIndividualAssessmentDocument>("individual-assessments", individualAssessmentSchema);

