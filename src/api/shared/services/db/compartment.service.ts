import { query } from "express";
import compartmentModel from "src/api/features/compartment/models/compartment.model";
import { ICompartment } from "src/api/features/compartment/models/types";

export default function updateCompartmentServicesById({compartmentId, serviceId}:{compartmentId:string, serviceId:string}) {
    return new Promise((resolve, reject)=> {
        const query = { _id: compartmentId };
        const updateObj = { $push: { services: serviceId } }
    
        compartmentModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedService:ICompartment)=> resolve(updatedService))
        .catch((error)=> reject(error))
    })
}