import compartmentModel from "../../models/compartment.model"

export default function getCompartmentByTitle(title:String) {
    return new Promise((resolve, reject)=> {
        const query = { title }

        compartmentModel.findOne(query)
        .then((foundCompartment)=> resolve(foundCompartment))
        .catch((error)=> reject(error))
    })
}