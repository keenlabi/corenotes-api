import { medicationModel } from "../model/medication.model";
import { IMedicationDocument } from "../model/types";

export interface IFetchMedicationsList {
    currentPage:number;
    totalPages:number;
    medications:Array<IMedication>;
}

export interface IMedication {
    id:string;
    medicationId:number;
    name:string;
    strength:string;
    medType:string;
    category:string;
    currentAmount:number;
    barCode:number;
}

export default function fetchMedicationsList(pageNumber:number) {
    return new Promise<IFetchMedicationsList>((resolve, reject)=> {
        const   queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        medicationModel.find()
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundMedications:IMedicationDocument[])=> {

            const mappedMedications:Array<IMedication>  = [];

            for await ( const medication of foundMedications ) {
                mappedMedications.push({
                    id: medication._id.toString(),
                    medicationId: medication.medicationId!,
                    name: medication.name,
                    strength: medication.strength,
                    medType: medication.medType,
                    category: medication.category,
                    currentAmount: medication.amount.current,
                    barCode:medication.barCode 
                })
            }

            medicationModel.count()
            .then((totalMedicationsCount:number)=> {
                
                const totalPageNumber = Math.ceil(totalMedicationsCount / resultsPerPage);

                resolve({
                    currentPage: pageNumber, 
                    totalPages: totalPageNumber,
                    medications: mappedMedications
                })
            })

        })
        .catch((error)=> {
            console.log(error)
            reject(error)
        })
    })
}