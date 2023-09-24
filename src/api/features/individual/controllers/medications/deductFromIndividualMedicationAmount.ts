import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { getIndividualByObjectId } from "src/api/shared/services/db/individual.service";
import { getMedicationByObjectId } from "src/api/shared/services/db/medication.service";
import { getTaskByTaskId } from "src/api/shared/services/db/task.service";

export default function deductFromIndividualMedicationAmount(taskId:number, amountAdministered:number, amountLeft:number) {
    return new Promise(async (resolve, reject)=> {

        const foundTask = await getTaskByTaskId(taskId);
        if(!foundTask) {
            const notFoundError = new NotFoundError('Task details not found');
            reject(notFoundError)
        }

        const foundIndividual = (await getIndividualByObjectId(foundTask.individualId));
        if(!foundIndividual) {
            const notFoundError = new NotFoundError('Individual profile not found');
            reject(notFoundError)
        }

        const foundMedication = await getMedicationByObjectId(foundTask.medicationId!);
        if(!foundMedication) {
            const notFoundError = new NotFoundError('medication details not found');
            reject(notFoundError)
        }

        const IndividualmedicationToUpdate = foundIndividual?.medications.filter(medication => medication.medicationId === foundMedication?._id.toString())[0]
    
        const query = { 
            individualId: foundIndividual?.individualId, 
            "medications.medicationId": foundMedication?._id.toString() 
        };

        const resultCurrentAmount = amountLeft;
        const resultAdministeredAmount = IndividualmedicationToUpdate?.amount.administered  ?? 0 + amountAdministered;

        const updateObj = { 
            $set: {
                "medications.$.amount.current": resultCurrentAmount,
                "medications.$.amount.administered": resultAdministeredAmount
            }
        }

        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual)=> resolve(updatedIndividual))
        .catch((error)=> reject(error))
    })
}