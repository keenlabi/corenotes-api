import serviceModel from "src/api/features/services/models/service.model";
import { IService } from "src/api/features/services/models/types";

export function getServiceByObjectId(serviceObjectId:string){
    return new Promise<IService>((resolve, reject)=> {
        const query = { _id: serviceObjectId };

        serviceModel.findOne(query)
        .then((foundService)=> resolve(foundService))
        .catch((error)=> reject(error))
    })
}

export function updateServiceAssignedIndividualsById(serviceId:string, individualId:string) {
    return new Promise<IService>((resolve, reject)=> {
        const query = { _id: serviceId }
        const updateObj = { $push: { assignedIndividuals:  individualId } }

        serviceModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedService:IService)=> resolve(updatedService))
        .catch((error)=> reject(error))
    })
}

export function updateServiceCompartmentsById({compartmentId, serviceId}:{compartmentId:string, serviceId:string}) {
    return new Promise((resolve, reject)=> {
        const query = { _id: serviceId };
        const updateObj = { $push: { compartments: compartmentId } }
    
        serviceModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedService:IService)=> resolve(updatedService))
        .catch((error)=> reject(error))
    })
}