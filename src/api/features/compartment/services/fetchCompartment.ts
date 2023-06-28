import getCompartmentByCompartmentId from "./db/getCompartmentByCompartmentId";

export interface IFetchCompartment {
    id:string,
    compartmentId:number,
    title:string;
    requestedServices:Array<{
        title:string,
        staffRoles:Array<string>,
        individuals:Array<string>
    }>,
    image:string;
    staffRoles:Array<string>;
    assignedIndividuals:Array<string>;
    createdAt:Date;
}

export default function fetchCompartment(compartmentId:number) {
    return new Promise<IFetchCompartment>((resolve, reject)=> {
        getCompartmentByCompartmentId(compartmentId)
        .then((foundCompartment)=> {
            resolve({
                id: foundCompartment._id.toString(),
                compartmentId: foundCompartment.compartmentId,
                title: foundCompartment.title,
                requestedServices: foundCompartment.requestedServices,
                image: foundCompartment.image,
                staffRoles: foundCompartment.staffRoles,
                assignedIndividuals: foundCompartment.assignedIndividuals,
                createdAt: foundCompartment.createdAt
            })
        })
        .catch((error)=> reject(error))
    })
}