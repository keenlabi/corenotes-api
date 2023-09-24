import {updateCompartmentServicesById} from "src/api/shared/services/db/compartment.service";
import { updateServiceCompartmentsById } from "src/api/shared/services/db/service.service";
import { ICompartment } from "../../compartment/models/types";

export function addServiceIdToCompartment({compartmentObjectId, serviceObjectId}:{compartmentObjectId:string, serviceObjectId:string}) {
    return new Promise<ICompartment>((resolve, reject)=> {
        
        let compartment:ICompartment;

        

        updateCompartmentServicesById({
            compartmentId: compartmentObjectId, 
            serviceId: serviceObjectId
        })
        .then((updatedCompartment)=> {
            compartment = updatedCompartment
        })
        .catch((error)=> reject(error))
        .finally(()=> {
            updateServiceCompartmentsById({
                serviceId: serviceObjectId,
                compartmentId: compartmentObjectId
            })
            .then(()=> resolve(compartment))
            .catch((error)=> reject(error))
        })
    })
}