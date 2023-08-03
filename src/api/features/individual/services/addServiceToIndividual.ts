import {getIndividualByIndividualId, updateIndividualServicesById} from "@services/db/individual.service";
import { IAssignServiceToIndividualReqBody } from "./validateAssignIndividualServiceRequest";
import { IIndividualServicesList } from "./fetchAllIndividualServices";
import { getServiceByObjectId, updateServiceAssignedIndividualsById } from "@services/db/service.service";
import { ConflictError, NotFoundError } from "@globals/server/Error";
import detMedSchedule from "./detMedSchedule";

export default function addServiceToIndividual(data:IAssignServiceToIndividualReqBody) {
    return new Promise((resolve, reject)=> {
        getIndividualByIndividualId(parseInt(data.individualId))
        .then((foundIndividual)=> {
            if(!foundIndividual) {
                const notFoundError = new NotFoundError('Individual not found');
                reject(notFoundError)
                return;
            }

            if(foundIndividual!.services.filter(service => service.serviceId === data.serviceId).length) {
                const conflictError = new ConflictError("Service cannot be added to individual more than once");
                reject(conflictError);
                return;
            }

            updateIndividualServicesById({ ...data, individualId: foundIndividual!._id.toString() })
            .then(async (updatedIndividual)=> {

                const service = await getServiceByObjectId(data.serviceId);

                if(!service?.assignedIndividuals.includes(updatedIndividual?._id.toString()!)){
                    await updateServiceAssignedIndividualsById(data.serviceId, updatedIndividual?._id.toString()!)
                }

                const servicesDetails:IIndividualServicesList[] = [];
            
                for await ( const service of updatedIndividual!.services.reverse() ) {

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
        .catch((error)=> reject(error))
        })
    })
}