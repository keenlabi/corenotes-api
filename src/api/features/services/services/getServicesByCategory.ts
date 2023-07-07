import { Request, Response } from "express";
import serviceModel from "../models/service.model";
import { IService } from "../models/types";
import { IServiceListItem, IServicesResponseFormat } from "./types";

export default function getServicesByCategory(category:string, pageNumber:number) {
    return new Promise<IServicesResponseFormat>((resolve, reject)=> {
        const queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        let query = {};

        category === 'all' 
        ?   query = { }
        :   query = { category }

        serviceModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then((foundServices:IService[])=> {
            const formattedServices:IServiceListItem[] = foundServices.map((service)=> {
                return {
                    id: service._id.toString(),
                    serviceId: service.serviceId,
                    title: service.title,
                    category: service.category,
                    compartments: service.compartments,
                    staffRolesCount: service.staffRoles.length,
                    assignedIndividualsCount: service.assignedIndividuals.length,
                    createdAt: service.createdAt
                }
            })

            serviceModel.count()
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