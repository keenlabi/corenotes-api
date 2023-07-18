import { ConflictError, NotFoundError } from "@globals/server/Error";
import individualModel from "@individual/models/individual.model";
import { IIndividualDocument } from "@individual/models/types";

export function getIndividualByObjectId(individualObjectId:string) {
    return new Promise<IIndividualDocument>((resolve, reject)=> {
        const query = { _id: individualObjectId };

        individualModel.findOne(query)
        .then((foundIndividual)=> {
            if(!foundIndividual) {
                const notFoundError = new NotFoundError("Individual not found");
                reject(notFoundError);
            }

            resolve(foundIndividual)
        })
        .catch((error)=> reject(error))
    })
}

export function getIndividualByIndividualId(individualId:number) {
    return new Promise<IIndividualDocument>((resolve, reject)=> {
        const query = { individualId };

        individualModel.findOne(query)
        .then((foundIndividual)=> {
            if(!foundIndividual) {
                const notFoundError = new NotFoundError("Individual not found");
                reject(notFoundError);
            }

            resolve(foundIndividual)
        })
        .catch((error)=> reject(error))
    })
}

export function updateIndividualServicesById({individualId, serviceId, startDate}:{individualId:string, serviceId:string, startDate:string}) {
    return new Promise<IIndividualDocument|null>((resolve, reject)=> {

        const query = { _id: individualId };

        const newService = {
            serviceId: serviceId,
            startDate: startDate
        }

        individualModel.findOne(query)
        .then((foundIndividual:IIndividualDocument)=> {
            if(foundIndividual.services.filter(service => service.serviceId === newService.serviceId).length) {
                const conflictEror = new ConflictError("Service has previously been added to individual");
                reject(conflictEror);
            }

            const updateObj = { $push: { services: newService } }
    
            individualModel.findOneAndUpdate(query, updateObj, { new: true })
            .then((updatedIndividual:IIndividualDocument)=> {
                if(!updatedIndividual) {
                    const notFoundError = new NotFoundError("Individual not found")
                    reject(notFoundError);
                }
                resolve(updatedIndividual)
            })
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    })
}

export function getIndividualsByMedicationObjectId(medicationObjectId:string) {
    return new Promise<Array<IIndividualDocument>>((resolve, reject)=> {
        const query = { medications: medicationObjectId }

        individualModel.find(query)
        .sort({ createdAt: -1 })
        .then((foundIndividuals)=> resolve(foundIndividuals))
        .catch((error)=> reject(error))
    })
}

export function updateIndividualMedicationsByIndividualId({
    individualId, 
    medicationId, 
    schedule,
    amountAllocated
}:{
    individualId:number, 
    medicationId:string, 
    schedule:{
        startDate:string;
        frequency:string;
        frequencyAttr:number;
        time:string;
    },
    amountAllocated:number
}) {
    return new Promise<IIndividualDocument|null>((resolve, reject)=> {
        const query = { individualId }

        const newMedication = {
            medicationId,
            schedule: schedule,
            amount: { 
                allocated: amountAllocated,
                current: amountAllocated,
                administered: 0
            }
        }

        const updateObj = { $push: { medications: newMedication } }

        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual)=> resolve(updatedIndividual))
        .catch((error)=> reject(error))
    })
}