import { NotFoundError } from "@globals/server/Error"
import { individualModel } from "@individual/models/individual.model"
import { IIndividualMedication } from "@individual/models/types"

export default function deactivateIndividualMedication(medicationObjectId:string, individualId:number, newState:boolean) {
    return new Promise<IIndividualMedication[]>((resolve, reject)=> {

        const query = { individualId, "medications.medicationId": medicationObjectId }
        const updateObj = { $set: { "medications.$.active": newState } }

        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual)=> {
            if(!updatedIndividual) {
                const notFoundError = new NotFoundError("Individual medication not found")
                reject(notFoundError);
            }

            resolve(updatedIndividual!.medications)
        })
        .catch((error)=> reject(error))
    })
}