import { getMedicationByMedicationId, updateMedicationServicesByMedicationId } from "@services/db/medication.service"
import { updateServiceMedicationsByServiceObjectId } from "@services/db/service.service";
import fetchMedication from "./fetchMedication";
import { NotFoundError } from "@globals/server/Error";

export default function addMedicationToService(medicationId:number, serviceObjectId:string) {
    return new Promise((resolve, reject)=> {
        updateMedicationServicesByMedicationId(medicationId, serviceObjectId)
        .then((updatedMedicationDocument)=> {
            if(!updatedMedicationDocument) {
                const notFoundError = new NotFoundError('Medication not found');
                reject(notFoundError)
            }

            updateServiceMedicationsByServiceObjectId(serviceObjectId, updatedMedicationDocument?._id.toString()!)
            .then((updatedServiceDocument)=> {
                if(!updatedServiceDocument) {
                    const notFoundError = new NotFoundError('Service not found');
                    reject(notFoundError)
                }

                fetchMedication(medicationId)
                .then((response)=> resolve(response))
                .catch((error)=> reject(error))
            })
            .catch((error)=> reject(error))
        });
    })
}