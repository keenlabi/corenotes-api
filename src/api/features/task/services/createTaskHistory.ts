import { Types } from "mongoose";
import { medicationAdministrationHistoryModel } from "../../medication/model/medicationadministrationhistory.model"
import { IMedicationAdministrationHistoryDocument } from "../../medication/model/types";

export interface IAdministerMedicationHistory {
    individualId:number;
    individualMedicationId:string;
    medicationId:string;
    staffId:number;
    title:string;
    image?:string;
    amountAdministered:number;
    note:string;
}

export default function createTaskHistory(requestBody:IAdministerMedicationHistory) {
    return new Promise((resolve, reject)=> {

        const newData:IMedicationAdministrationHistoryDocument = {
            _id: new Types.ObjectId(),
            individualRef: requestBody.individualId,
            individualMedicationRef: requestBody.individualMedicationId,
            medicationId: requestBody.medicationId,
            staffRef: requestBody.staffId,
            title: "PRN medication administration",
            imageURL: requestBody.image,
            amountAdministered: requestBody.amountAdministered,
            note: requestBody.note
        }

        medicationAdministrationHistoryModel.create(newData)
        .then((createdHistory)=> {
            resolve({
                id: createdHistory._id.toString(),
                historyId: createdHistory.historyId!,
                title: createdHistory.title,
                amountAdministered: createdHistory.amountAdministered,
                image: createdHistory.imageURL,
                note: createdHistory.note,
                createdAt: createdHistory.createdAt!
            });
        })
        .catch((error)=> reject(error))
    })
}