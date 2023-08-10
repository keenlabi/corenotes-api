import { medicationModel } from "../model/medication.model";
import { IMedicationDocument } from "../model/types";
import { INewMedicationData } from "./makeMedication";

export default function saveMedication(newMedData:INewMedicationData) {
    return new Promise<IMedicationDocument>((resolve, reject)=> {
        medicationModel.create(newMedData)
        .then((createdMedicationDocument)=> resolve(createdMedicationDocument))
        .catch((error)=> reject(error))
    })
}