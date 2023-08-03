import { Types } from "mongoose";
import { createAssessmentReqBodyType, validateCreateAssessmentType } from "./types";
import { getAssessmentByTitle } from "@services/db/assessment.service";

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
        if(!Types.ObjectId.isValid(data.category)) reject({ status: false, code: 422,  message:'Category is not a valid value field cannot be empty' });
        
        if(!data.questions.length) reject({ status: false, code: 422,  message:'Questions field cannot be empty' });
        
        if(!data.assignedTo) reject({ status: false, code: 422,  message:'Assigned to type field cannot be empty' });
        if(data.assignedTo && !['services', 'individuals'].includes(data.assignedTo)) reject({ status: false, code: 422,  message:'Assigned to is not a valid option' });

        if(!data.assignees.assigneesType) reject({ status: false, code: 422,  message:'Assignees type field cannot be empty' });
        if(data.assignees.assigneesType && !['ALL', 'SPECIFIC'].includes(data.assignees.assigneesType)) reject({ status: false, code: 422,  message:'Assignees type is not a valid option' });
        if(data.assignees.assigneesType === 'SPECIFIC' && !data.assignees.assigneesList.length) reject({ status: false, code: 422,  message:'A specific assignees list field cannot be empty' });

        // return success if true
        resolve({ status:true, code:200, message: 'SUCCESS', requestBody: data });
    })
}