import serviceModel from "../models/service.model"
import { IService } from "../models/types"
import { ICreateServiceRequestBody, IServiceResponseFormat } from "./types"

export default function createNewService(newServiceData:ICreateServiceRequestBody) {
    return new Promise<IServiceResponseFormat>((resolve, reject)=> {

        serviceModel.create(newServiceData)
        .then((createdServiceDocument:IService)=> {

            const createdService:IServiceResponseFormat = Object.freeze({
                id: createdServiceDocument._id.toString(),
                serviceId: createdServiceDocument.serviceId,
                title: createdServiceDocument.title,
                compartments: createdServiceDocument.compartments,
                staffRoles: createdServiceDocument.staffRoles,
                assignedIndividuals: createdServiceDocument.assignedIndividuals,
                createdAt: createdServiceDocument.createdAt
            })

            resolve(createdService)
        })
        .catch((error)=> reject(error))
    })
}