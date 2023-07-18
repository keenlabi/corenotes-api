import { NotFoundError } from "@globals/server/Error";
import individualModel from "@individual/models/individual.model";
import { IIndividualDocument } from "@individual/models/types";
import { getIndividualByIndividualId } from "@services/db/individual.service";
import { getMedicationByMedicationId } from "@services/db/medication.service";

export default function addToIndividualMedicationAllocatedAmount(individualId:number, medicationId:string, newAllocatedAmount:number) {
    return new Promise<IIndividualDocument|null>((resolve, reject)=> {
        getIndividualByIndividualId(individualId)
        .then((foundIndividual)=> {

            if(!foundIndividual) {
                const notFoundError = new NotFoundError('Individual profile not found');
                reject(notFoundError)
            }

            getMedicationByMedicationId(parseInt(medicationId))
            .then((foundMedication)=> {

                if(!foundMedication) {
                    const notFoundError = new NotFoundError('medication details not found');
                    reject(notFoundError)
                }

                const medicationToUpdate = foundIndividual.medications.filter(medication => medication.medicationId === foundMedication?._id.toString())[0]
            
                const query = { individualId, "medications.medicationId": foundMedication?._id.toString() };

                const totalAllocatedAmount = medicationToUpdate.amount.allocated + newAllocatedAmount;
                const totalCurrentAmount = medicationToUpdate.amount.current + newAllocatedAmount;

                const updateObj = { 
                    $set: {
                        "medications.$.amount.allocated": totalAllocatedAmount,
                        "medications.$.amount.current": totalCurrentAmount
                    }
                }

                individualModel.findOneAndUpdate(query, updateObj, { new: true })
                .then((updatedIndividual)=> resolve(updatedIndividual))
                .catch((error)=> reject(error))
            })
        })
        .catch((error)=> reject(error))
    })
}