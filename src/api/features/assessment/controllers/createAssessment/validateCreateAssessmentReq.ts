import { Types } from "mongoose";
import { createAssessmentReqBodyType, validateCreateAssessmentType } from "./types";
import { getAssessmentByTitle } from "@services/db/assessment.service";
import { AssessmentTypesList } from "src/api/features/assessment/model/assessment.model.ts/types";

export default function validateCreateAssessmentReq(data:createAssessmentReqBodyType) {
    return new Promise<validateCreateAssessmentType>(async (resolve, reject)=> {

        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ status: false, code: 422, message:'Input field cannot be empty' })

        if(!data.title) reject({ status: false, code: 422,  message:'Title field cannot be empty' });

        await getAssessmentByTitle(data.title)
        .then((foundAssessment)=> {
            if(foundAssessment) reject({ status: false, code: 422,  message:'An assessment with this title already exists' });
        })
        .catch(()=> reject({ status: false, code: 422,  message:'There was an error validating request' }));

        if(!data.category) reject({ status: false, code: 422,  message:'Category field cannot be empty' });
        if(!Types.ObjectId.isValid(data.category)) reject({ status: false, code: 422,  message:'Category is not valid' });
        
        if(!data.questions.length) reject({ status: false, code: 422,  message:'Questions field cannot be empty' });

        // return success if true
        resolve({ status:true, code:200, message: 'SUCCESS', requestBody: data });
    })
}