import { query } from "express";
import compartmentModel from "src/api/features/compartment/models/compartment.model";
import { ICompartment } from "src/api/features/compartment/models/types";

export function updateCompartmentServicesById({compartmentId, serviceId}:{compartmentId:string, serviceId:string}) {
    return new Promise<ICompartment|null>((resolve, reject)=> {
        const query = { _id: compartmentId };
        const updateObj = { $push: { services: serviceId } }
    
        compartmentModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedService)=> resolve(updatedService))
        .catch((error)=> reject(error))
    })
}

export function getCompartmentById(compartmentId:string) {
    return new Promise<ICompartment|null>((resolve, reject)=> {
        const query = { _id: compartmentId };
    
        compartmentModel.findOne(query)
        .then((foundCompartment)=> {
            resolve(foundCompartment)
        })
        .catch((error)=> reject(error))
    })
}