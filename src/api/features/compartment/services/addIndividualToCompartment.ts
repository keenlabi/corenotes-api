import compartmentModel from "../models/compartment.model"

export default function addIndividualToSubCompartment(compartmentId:string, subCompartmentId:string, individualId:string) {
    return new Promise((resolve, reject)=> {

        const query = { _id: compartmentId, "subCompartments._id": subCompartmentId };
        const updateObj = { $push: { "subCompartments.$.individuals": individualId } }

        compartmentModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedCompartment)=> resolve(updatedCompartment))
        .catch((error)=> reject(error))
    })
}