import { getMedicationByObjectId } from "src/api/shared/services/db/medication.service";
import getPRNMedicationHistoryByIndividualMedicationRef from "./getPRNMedicationHistoryByIndividualMedicationRef"

export interface IPRNMedication {
    id:string;
    title:string;
    note:string;
    name:string;
    amountAdministered:number;
    createdAt:Date;
}   

export default function fetchIndividualMedicationPRNs(individualId:string) {
    return new Promise<IPRNMedication[]>((resolve, reject)=> {
        getPRNMedicationHistoryByIndividualMedicationRef(individualId)
        .then(async (foundPRNMedication)=> {
            if(foundPRNMedication.length) {

            }

            const PRNMedicationMapped:IPRNMedication[] = []

            for await (const PRNMedication of foundPRNMedication) {
                const foundMedication = await getMedicationByObjectId(PRNMedication.medicationId)
                
                PRNMedicationMapped.push({
                    id: PRNMedication._id.toString(),
                    title: PRNMedication.title,
                    note: PRNMedication.note,
                    name: foundMedication?.name ?? "",
                    amountAdministered: PRNMedication.amountAdministered,
                    createdAt: PRNMedication.createdAt!
                })
            }

            resolve(PRNMedicationMapped)
        })
        .catch((error)=> reject(error))
    })
}