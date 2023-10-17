import serviceModel from "src/api/features/services/models/service.model";
import { IService } from "src/api/features/services/models/types";

export function getServiceByObjectId(serviceObjectId:string){
    return new Promise<IService|null>((resolve, reject)=> {
        const query = { _id: serviceObjectId };

        serviceModel.findOne(query)
        .then((foundService)=> resolve(foundService))
        .catch((error)=> reject(error))
    })
}

export function updateServiceAssignedIndividualsById(serviceId:string, individualId:string) {
    return new Promise<IService|null>((resolve, reject)=> {
        const query = { _id: serviceId }
        const updateObj = { $push: { assignedIndividuals:  individualId } }

        serviceModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedService)=> resolve(updatedService))
        .catch((error)=> reject(error))
    })
}

export function updateServiceCompartmentsById(serviceId:string, compartmentId:string) {
    return new Promise<IService|null>((resolve, reject)=> {
        const query = { _id: serviceId };
        const updateObj = { $push: { compartments: compartmentId } }
    
        serviceModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedService)=> resolve(updatedService))
        .catch((error)=> reject(error))
    })
}

export function updateServiceMedicationsByServiceObjectId(serviceObjectId:string, medicationObjectId:string) {
    return new Promise<IService|null>((resolve, reject)=> {
        const query = { _id: serviceObjectId };
        const updateObj = { $push: { medications: medicationObjectId } }
    
        serviceModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedService)=> resolve(updatedService))
        .catch((error)=> reject(error))
    })
}

export function updateServiceMedicationsByServiceId(medicationObjectId:string, serviceId:number) {
    return new Promise<IService|null>((resolve, reject)=> {
        const query = { serviceId }
        const updateObj = { $push: { medications: medicationObjectId } }
    
        serviceModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedService)=> resolve(updatedService))
        .catch((error)=> reject(error))
    })
}