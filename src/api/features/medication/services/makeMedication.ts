import { Types } from "mongoose";
import { IMedicationDocument } from "../model/types";
import { ICreateMedicationRequest } from "./validateCreateMedicationRequest";

export interface INewMedicationData extends Omit<IMedicationDocument, 'barCode'> {}

export default function makeMedication(requestBody:ICreateMedicationRequest):INewMedicationData {
    
    const medDocumentObjectId = new Types.ObjectId();
    
    return Object.freeze({
        _id: medDocumentObjectId,
        name: requestBody.name,
        strength: requestBody.strength,
        route: requestBody.route,
        medType: requestBody.medType,
        indications: requestBody.indications,
        providers: requestBody.providers,
        pharmarcy: requestBody.pharmarcy,
        prescriber: requestBody.prescriber,
        instructions: requestBody.instructions,
        category: requestBody.category,
        amount: {
            current: requestBody.amount,
            allocated: requestBody.amount,
            administered: 0
        },
        services:[]
    })
}