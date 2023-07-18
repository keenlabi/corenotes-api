import getServiceByServiceId from "./db/getServiceByServiceId";

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

export default function fetchService(serviceId:number) {
    return new Promise<IFetchService>((resolve, reject)=> {
        getServiceByServiceId(serviceId)
        .then((foundService)=> {
            resolve({
                id: foundService!._id.toString(),
                serviceId: foundService!.serviceId,
                title: foundService!.title,
                category: foundService!.category,
                compartments: foundService!.compartments,
                staffRoles: foundService!.staffRoles,
                assignedIndividuals: foundService!.assignedIndividuals,
                createdAt: foundService!.createdAt
            })
        })
        .catch((error)=> {
    
        })
    })
}