import { Types } from "mongoose"
import { individualAssessmentModel } from "@individual/models/individual-assessment.model"
import { IIndividualAssessmentDocument } from "@individual/models/types"
import { getAssessmentByObjId } from "@services/db/assessment.service"

export default function createIndividualAssessmentSession(assessmentObjId:string, individualObjId:string) {
    return new Promise<IIndividualAssessmentDocument>((resolve, reject)=> {
        getAssessmentByObjId(assessmentObjId)
        .then((foundAssessment)=> {
            const newIndividualAssessmentSession:IIndividualAssessmentDocument = {
                _id: new Types.ObjectId(),
                assessmentId: assessmentObjId,
                individualId: individualObjId,
                title: foundAssessment!.title,
                questions: foundAssessment!.questions.map(question => ({
                    _id: new Types.ObjectId(),
                    category: question.category,
                    question: question.question,
                    answer:"",
                    comment:""
                })),
            }

            individualAssessmentModel.create(newIndividualAssessmentSession)
            .then((createdAssessmentSession)=> {
                resolve(createdAssessmentSession)
            })
            .catch((error)=> {
                console.log("There was an error creating assessment session")
                reject(error)
            })

        })
        .catch((error)=> {
            console.log("There was an error finding assessment to create new assessment session with")
            reject(error)
        })
    })
}