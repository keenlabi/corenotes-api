import compartmentModel from "../../models/compartment.model"
import { ICompartment } from "../../models/types"

export default function getCompartmentByCompartmentId(compartmentId:number) {
    return new Promise<ICompartment>((resolve, reject)=> {

        const query = { compartmentId }
        
        compartmentModel.findOne(query)
        .then((foundCompartment:ICompartment)=> resolve(foundCompartment))
        .catch((error)=> reject(error))
    })
}