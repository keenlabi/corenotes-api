import { getServiceByObjectId } from "@services/db/service.service";
import { IUser } from "@user/models/types";
import userModel from "@user/models/user.model";

export interface IIndividualServicesList {
    id:string;
    serviceId:number;
    title:string;
    category:string;
    startDate:string;
}

export default function fetchAllIndividualServices(individualObjectId:string) {
    return new Promise<IIndividualServicesList[]>((resolve, reject)=> {
        const query = { _id: individualObjectId }

        userModel.findOne(query)
        .then(async (foundUser:IUser)=> {
            const servicesDetails:IIndividualServicesList[] = [];
            
            for await ( const service of foundUser.requestedServices.reverse() ) {
                await getServiceByObjectId(service.service)
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