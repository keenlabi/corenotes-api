import { Types } from "mongoose"
import { medicationAdministrationHistoryModel } from "../../medication/model/medicationadministrationhistory.model"
import { IMedicationAdministrationHistoryDocument } from "../../medication/model/types"
import addPRNToIndividualMedication from "./addPRNToIndividualMedication";

interface IAdministerPRNMedicationResponse {
    id:string;
    historyId:number;
    title:string;
    amountAdministered:number;
    note:string;
    createdAt:Date
}

interface IAdministerPRNMedication {
    individualId:number;
    individualMedicationId:string;
    medicationId:string;
    staffId:number;
    amountAdministered:number;
    note:string;
}

export default function administerPRNMedication(requestBody:IAdministerPRNMedication) {
    return new Promise<IAdministerPRNMedicationResponse>((resolve, reject)=> {
        
        const newData:IMedicationAdministrationHistoryDocument = {
            _id: new Types.ObjectId(),
            individualRef: requestBody.individualId,
            individualMedicationRef: requestBody.individualMedicationId,
            medicationId: requestBody.medicationId,
            staffRef: requestBody.staffId,
            title: "PRN medication administration",
            amountAdministered: requestBody.amountAdministered,
            note: requestBody.note
        }

        medicationAdministrationHistoryModel.create(newData)
        .then((createdHistory)=> {
            addPRNToIndividualMedication(createdHistory.individualRef, createdHistory.individualMedicationRef, createdHistory._id.toString())
            .catch((error)=> {
                console.log("Couldn't add prn record to the individual medication due to error => ", error)
            })
            .finally(()=> {
                resolve({
                    id: createdHistory._id.toString(),
                    historyId: createdHistory.historyId!,
                    title: createdHistory.title,
                    amountAdministered: createdHistory.amountAdministered,
                    note: createdHistory.note,
                    createdAt: createdHistory.createdAt!
                });
            })
        })
        .catch((error)=> reject(error))
    })
}