import { NotFoundError } from "@globals/server/Error";
import getCompartmentByCompartmentId from "./db/getCompartmentByCompartmentId";

export interface IFetchCompartment {
    id:string;
    compartmentId:number;
    title:string;
    subCompartments:Array<{
        id:string;
        title:string;
        description:string;
        servicesCount:number;
        individualsCount:number;
        createdAt:Date;
    }>;
    image:string;
    createdAt:Date;
}

export default function fetchCompartment(compartmentId:number) {
    return new Promise<IFetchCompartment>(async (resolve, reject)=> {
        await getCompartmentByCompartmentId(compartmentId)
        .then(async (foundCompartment)=> {
            if(!foundCompartment) {
                new NotFoundError('Compartment not found');
                reject(NotFoundError);
                return
            }

            const compartment:IFetchCompartment = {
                id: foundCompartment._id.toString(),
                compartmentId: foundCompartment.compartmentId,
                title: foundCompartment.title,
                image: foundCompartment.image,
                subCompartments: foundCompartment.subCompartments.map((subCompartment)=> ({
                    id: subCompartment.id,
                    title: subCompartment.title,
                    description: subCompartment.description,
                    servicesCount: subCompartment.services.length,
                    individualsCount: subCompartment.individuals.length,
                    createdAt: subCompartment.createdAt
                })),
                createdAt: foundCompartment.createdAt
            }

            resolve(compartment)
        })
        .catch((error)=> reject(error))
    })
}