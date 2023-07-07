import {getIndividualByIndividualId, updateIndividualServicesById} from "@services/db/individual.service";
import { IAssignServiceToIndividualReqBody } from "./validateAssignIndividualServiceRequest";
import { IIndividualServicesList } from "./fetchAllIndividualServices";
import { getServiceByObjectId, updateServiceAssignedIndividualsById } from "@services/db/service.service";

export default function addServiceToIndividual(data:IAssignServiceToIndividualReqBody) {
    return new Promise((resolve, reject)=> {
        getIndividualByIndividualId(parseInt(data.individualId))
        .then((foundIndividual)=> {
            updateIndividualServicesById({ ...data, individualId: foundIndividual._id.toString() })
            .then(async (updatedIndividual)=> {

                updateServiceAssignedIndividualsById(data.serviceId, data.individualId)
                .finally(async ()=> {
                    const servicesDetails:IIndividualServicesList[] = [];
                
                    for await ( const service of updatedIndividual.services.reverse() ) {

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
            })
            .catch((error)=> reject(error))
        .catch((error)=> reject(error))
        })
    })
}