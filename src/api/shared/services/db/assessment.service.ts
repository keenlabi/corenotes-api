import { assessmentModel } from "@assessment/model/assessment.model.ts";
import { IAssessmentDocument } from "@assessment/model/assessment.model.ts/types";

export function getAssessmentByTitle(title:string) {
    return new Promise<IAssessmentDocument|null>((resolve, reject)=> {
        
        const query = { title: title.toLowerCase()  }

        assessmentModel.findOne(query)
        .then((foundAssessment)=> resolve(foundAssessment))
        .catch(error => reject(error))
    })
}

export function getAssessmentByObjId(assessmentObjId:string) {
    return new Promise<IAssessmentDocument|null>((resolve, reject)=> {
        
        const query = { _id: assessmentObjId }

        assessmentModel.findOne(query)
        .then((foundAssessment)=> resolve(foundAssessment))
        .catch(error => reject(error))
    })
}


export function getAssessmentByAssessmentId(assessmentId:number) {
    return new Promise<IAssessmentDocument|null>((resolve, reject)=> {
        
        const query = { assessmentId };

        assessmentModel.findOne(query)
        .then((foundAssessment)=> resolve(foundAssessment))
        .catch((error)=> reject(error))
    })
}