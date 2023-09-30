import compartmentModel from "../models/compartment.model"
import { ICompartment, ISubCompartment } from "../models/types";

export default function findSubCompartmentByTitle(compartmentId:number, subcompartmentTitle:string) {
    return new Promise<ISubCompartment|null>((resolve, reject)=> {
        
        const query = { compartmentId: compartmentId };

        compartmentModel.findOne(query)
        .then((foundCompartment)=> {
            const foundMatch = foundCompartment?.subCompartments.filter(subCompartment => subCompartment.title === subcompartmentTitle);
            if(foundMatch?.length) resolve(foundMatch[0]);
            else resolve(null);
        })
        .catch((error)=> reject(error))
    })
}