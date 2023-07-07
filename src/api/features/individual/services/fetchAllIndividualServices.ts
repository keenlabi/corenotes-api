import { getIndividualByIndividualId } from "@services/db/individual.service";
import { getServiceByObjectId } from "@services/db/service.service";
import { IUserDocument } from "@user/models/types";
import userModel from "@user/models/user.model";

export interface IIndividualServicesList {
    id:string;
    serviceId:number;
    title:string;
    category:string;
    startDate:string;
}

export default function fetchAllIndividualServices(individualId:number) {
    return new Promise<IIndividualServicesList[]>((resolve, reject)=> {
    
        getIndividualByIndividualId(individualId)
        .then(async (foundIndividual)=> {
            
            const servicesDetails:IIndividualServicesList[] = [];
            
            for await ( const service of foundIndividual.services.reverse() ) {
                await getServiceByObjectId(service.serviceId)
                .then((foundService)=> {
                    servicesDetails.push({
                        id: foundService._id.toString(),
                        serviceId: foundService.serviceId,
                        title: foundService.title,
                        category: foundService.category,
                        startDate: service.startDate
                    })
                })
            }

            resolve(servicesDetails)
        })
        .catch((error)=> reject(error))
    })
}