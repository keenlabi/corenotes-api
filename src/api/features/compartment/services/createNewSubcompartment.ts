import compartmentModel from "../models/compartment.model";
import { ICompartment } from "../models/types";

export interface INewSubcompartmentData {
    title:string;
}

export default function createNewSubcompartment(compartmentObjId:string, newCompartmentData:INewSubcompartmentData) {
    return new Promise<ICompartment|null>((resolve, reject)=> {

        const query = { compartmentId: compartmentObjId };
        const updateObj = { 
            $push: {
                subCompartments: { title: newCompartmentData.title }
            }
        }

        compartmentModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedCompartment)=> resolve(updatedCompartment))
        .catch((error)=> reject(error))
    })
}