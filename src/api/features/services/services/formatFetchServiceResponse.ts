import { IService } from "../models/types"

export interface IFetchService {
    id:string,
    serviceId:number,
    title:string,
    category:string,
    compartments:Array<string>
    staffRoles:Array<string>,
    assignedIndividuals:Array<string>,
    createdAt:Date
}

export default function formatFetchServiceResponse(service:IService) {
    return ({
        id: service._id.toString(),
        serviceId: service.serviceId,
        title: service.title,
        category: service.category,
        compartments: service.compartments,
        staffRoles: service.staffRoles,
        assignedIndividuals: service.assignedIndividuals,
        createdAt: service.createdAt
    })
}