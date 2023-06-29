import { getServiceByObjectId } from "@services/db/service.service";

export interface IFetchCompartmentServiceDetails {
    id:string;
    serviceId:number,
    title:string,
    individuals:Array<string>
}

export default function fetchCompartmentServicesDetails(services:Array<string>) {
    return new Promise<IFetchCompartmentServiceDetails[]>(async (resolve, reject)=> {
        
        const allServicesDetails:Array<IFetchCompartmentServiceDetails> = [];

        for await ( const service of services ) {
            await getServiceByObjectId(service)
            .then((foundService)=> {
                if(foundService) {
                    allServicesDetails.push({
                        id: foundService._id.toString(),
                        serviceId: foundService.serviceId,
                        title: foundService.title,
                        individuals: foundService.assignedIndividuals
                    })
                }
            })

        }

        resolve(allServicesDetails)
    });
}