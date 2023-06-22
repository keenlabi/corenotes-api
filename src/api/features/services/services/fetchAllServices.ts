import serviceModel from "../models/service.model";
import { IService } from "../models/types";
import { IServiceResponseFormat } from "./types";

export default function fetchAllServices(pageNumber:number) {
    return new Promise<IServiceResponseFormat[]>((resolve, reject)=> {

        const queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        serviceModel.find()
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then((foundServices:IService[])=> {

            const formattedServices:IServiceResponseFormat[] = foundServices.map((service)=> {
                return {
                    id: service._id.toString(),
                    serviceId: service.serviceId,
                    compartments: service.compartments,
                    title: service.title,
                    staffRoles: service.staffRoles,
                    assignedIndividuals: service.assignedIndividuals,
                    createdAt: service.createdAt
                }
            })

            resolve(formattedServices)
        })
        .catch((error)=> {
            console.log('SERVICE ERROR: There was an error fetching all services')
            reject(error)
        })
    })
}