import { medicationAdministrationHistoryModel } from "../../medication/model/medicationadministrationhistory.model"
import { IMedicationAdministrationHistoryDocument } from "../../medication/model/types"

export default function getPRNMedicationHistoryByIndividualMedicationRef(individualMedicationId:string) {
    return new Promise<IMedicationAdministrationHistoryDocument[]>((resolve, reject)=> {

        const query = { individualMedicationRef: individualMedicationId }

        medicationAdministrationHistoryModel.find(query)
        .then((foundMedicationHistory)=> resolve(foundMedicationHistory))
        .catch((error)=> reject(error))
    })
}