import { individualModel } from "@individual/models/individual.model";

export default function addPRNToIndividualMedication(individualId:number, individualMedicationId:string, prnMedicationId:string) {
    return new Promise((resolve, reject)=> {
        const query = { individualId, "medications.medicationId": individualMedicationId };
        const updateObj = { $push: { "medications.$.prn": prnMedicationId } }

        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual)=> resolve(updatedIndividual))
        .catch((error)=> reject(error))
    })
}