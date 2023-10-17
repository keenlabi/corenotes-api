import compartmentModel from "../../models/compartment.model"
import { ICompartment } from "../../models/types"

export default function getCompartmentByCompartmentId(compartmentId:number) {
    return new Promise<ICompartment|null>((resolve, reject)=> {

        const query = { compartmentId }
        
        compartmentModel.findOne(query)
        .then((foundCompartment)=> resolve(foundCompartment))
        .catch((error)=> reject(error))
    })
}