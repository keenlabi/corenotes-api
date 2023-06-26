import serviceModel from "../models/service.model"
import { IService } from "../models/types"
import { ICreateServiceRequestBody, IServiceListItem } from "./types"

export default function createNewService(newServiceData:ICreateServiceRequestBody) {
    return new Promise<IServiceListItem>((resolve, reject)=> {

        serviceModel.create(newServiceData) 
        .then((createdServiceDocument:IService)=> {

            const createdService:IServiceListItem = Object.freeze({
                id: createdServiceDocument._id.toString(),
                serviceId: createdServiceDocument.serviceId,
                title: createdServiceDocument.title,
                compartments: createdServiceDocument.compartments,
                staffRolesCount: createdServiceDocument.staffRoles.length,
                assignedIndividualsCount: createdServiceDocument.assignedIndividuals.length,
                createdAt: createdServiceDocument.createdAt
            })

            resolve(createdService)
        })
        .catch((error)=> reject(error))
    })
}