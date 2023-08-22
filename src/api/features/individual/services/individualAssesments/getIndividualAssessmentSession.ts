import { individualAssessmentModel } from "@individual/models/individual-assessment.model"
import { IIndividualAssessmentDocument } from "@individual/models/types"

export default function getIndividualAssessmentSession(assessmentObjId:string, individualObjId:string) {
    return new Promise<IIndividualAssessmentDocument|null>((resolve, reject)=> {

        const query = { assessmentId: assessmentObjId, individualId: individualObjId  }
        
        individualAssessmentModel.findOne(query)
        .then((foundAssessment)=> resolve(foundAssessment))
        .catch((error)=> reject(error))
    })
}