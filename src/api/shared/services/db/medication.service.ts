import { medicationModel } from "src/api/features/medication/model/medication.model"
import { IMedicationDocument } from "src/api/features/medication/model/types"

export function getMedicationByMedicationId(medicationId:number) {
    return new Promise<IMedicationDocument|null>((resolve, reject)=> {
        
        const query = { medicationId }

        medicationModel.findOne(query)
        .then((foundMedication)=> resolve(foundMedication))
        .catch((error)=> reject(error))
    })
}

export function getMedicationByObjectId(medicationObjectId:string) {
    return new Promise<IMedicationDocument|null>((resolve, reject)=> {
        
        const query = { _id: medicationObjectId }

        medicationModel.findOne(query)
        .then((foundMedication)=> resolve(foundMedication))
        .catch((error)=> reject(error))
    })
}

export function updateMedicationServicesByMedicationId(medicationId:number, serviceId:string) {
    return new Promise<IMedicationDocument|null>((resolve, reject)=> {
        const query = { medicationId };
        const updateObj = { $push: { services: serviceId } }

        medicationModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedMedication)=> resolve(updatedMedication))
        .catch((error)=> reject(error))
    })
}

export function getMedicationsByServiceObjectId(serviceObjectId:string, pageNumber:number) {
    return new Promise<{
        currentPage:number;
        totalPages:number;
        medications:Array<IMedicationDocument>;

    }>((resolve, reject)=> {
        const query = { services: serviceObjectId }

        const queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        medicationModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then((foundMedications)=> {

            medicationModel.count()
            .then((totalStaffCount:number)=> {
                const totalPageNumber = Math.ceil(totalStaffCount / resultsPerPage);

                resolve({
                    currentPage: queryPageNumber,
                    totalPages: totalPageNumber,
                    medications: foundMedications
                })
            })
        })
        .catch((error)=> reject(error))
    })
}