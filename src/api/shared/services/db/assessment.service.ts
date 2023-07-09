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