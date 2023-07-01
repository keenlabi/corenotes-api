import getCompartmentByCompartmentId from "./db/getCompartmentByCompartmentId";
import fetchServicesDetails from "./fetchServicesDetails";

export interface IFetchCompartment {
    id:string,
    compartmentId:number,
    title:string;
    services:Array<{
        serviceId:number,
        title:string,
        individuals:Array<string>
    }>,
    image:string;
    staffRoles:Array<string>;
    assignedIndividuals:Array<string>;
    createdAt:Date;
}

export default function fetchCompartment(compartmentId:number) {
    return new Promise<IFetchCompartment>(async (resolve, reject)=> {
        await getCompartmentByCompartmentId(compartmentId)
        .then(async (foundCompartment)=> {
            const compartment:IFetchCompartment = {
                id: foundCompartment._id.toString(),
                compartmentId: foundCompartment.compartmentId,
                title: foundCompartment.title,
                services: await fetchServicesDetails(foundCompartment.services),
                image: foundCompartment.image,
                staffRoles: foundCompartment.staffRoles,
                assignedIndividuals: foundCompartment.assignedIndividuals,
                createdAt: foundCompartment.createdAt
            }
            resolve(compartment)
        })
        .catch((error)=> reject(error))
    })
}