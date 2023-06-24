import userModel from "@user/models/user.model";
import serviceModel from "../models/service.model";
import { IService } from "../models/types";
import { IServiceListItem, IServicesResponseFormat } from "./types";

export default function fetchAllServices(pageNumber:number) {
    return new Promise<IServicesResponseFormat>((resolve, reject)=> {

        const queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        serviceModel.find()
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then((foundServices:IService[])=> {

            const formattedServices:IServiceListItem[] = foundServices.map((service)=> {
                return {
                    id: service._id.toString(),
                    serviceId: service.serviceId,
                    compartments: service.compartments,
                    title: service.title,
                    staffRolesCount: service.staffRoles.length,
                    assignedIndividualsCount: service.assignedIndividuals.length,
                    createdAt: service.createdAt
                }
            })

            userModel.count()
            .then((totalStaffCount:number)=> {
                const totalPageNumber = Math.ceil(totalStaffCount / resultsPerPage);

                resolve({
                    currentPage: queryPageNumber,
                    totalPages: totalPageNumber,
                    services: formattedServices
                })
            })
        })
        .catch((error)=> {
            console.log('SERVICE ERROR: There was an error fetching all services')
            reject(error)
        })
    })
}