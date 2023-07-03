import {updateCompartmentServicesById} from "@services/db/compartment.service";

export function addServiceIdToCompartment({compartmentObjectId, serviceObjectId}:{compartmentObjectId:string, serviceObjectId:string}) {
    return new Promise((resolve, reject)=> {
        updateCompartmentServicesById({
            compartmentId: compartmentObjectId, 
            serviceId: serviceObjectId
        })
        .then((updatedCompartment)=> resolve(updatedCompartment))
        .catch((error)=> reject(error))
    })
}