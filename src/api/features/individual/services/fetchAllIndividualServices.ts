import { NotFoundError } from "@globals/server/Error";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service";
import { getServiceByObjectId } from "src/api/shared/services/db/service.service";
import detMedSchedule from "./detMedSchedule";

export interface IIndividualServicesList {
    id:string;
    serviceId:number;
    title:string;
    category:string;
    startDate:string;
    time:string;
    frequency:string;
}

export default function fetchAllIndividualServices(individualId:number) {
    return new Promise<IIndividualServicesList[]>((resolve, reject)=> {
    
        getIndividualByIndividualId(individualId)
        .then(async (foundIndividual)=> {

            if(!foundIndividual) {
                const notFoundError = new NotFoundError('Individual not found');
                reject(notFoundError);
            }
            
            const servicesDetails:IIndividualServicesList[] = [];
            
            for await ( const service of foundIndividual!.services.reverse() ) {
                await getServiceByObjectId(service.serviceId)
                .then((foundService)=> {
                    if(foundService) {
                        servicesDetails.push({
                            id: foundService._id.toString(),
                            serviceId: foundService.serviceId,
                            title: foundService.title,
                            category: foundService.category,
                            startDate: service.schedule.startDate,
                            time: service.schedule.time,
                            frequency: detMedSchedule(service.schedule.frequency, service.schedule.startDate, service.schedule.frequencyAttr)
                        })
                    }
                })
            }

            resolve(servicesDetails)
        })
        .catch((error)=> reject(error))
    })
}