import { sendSuccessResponse } from "@globals/server/serverResponse"
import serviceModel from "../models/service.model"
import { IService } from "../models/types"
import { addServiceIdToCompartment } from "./addServiceIdToCompartment"
import { ICreateServiceRequestBody, IServiceListItem } from "./types"

export default function createNewService(newServiceData:ICreateServiceRequestBody) {
    return new Promise<IServiceListItem>((resolve, reject)=> {
        
        serviceModel.create(newServiceData) 
        .then((createdServiceDocument:IService)=> {

            const createdService:IServiceListItem = Object.freeze({
                id: createdServiceDocument._id.toString(),
                serviceId: createdServiceDocument.serviceId,
                title: createdServiceDocument.title,
                category: createdServiceDocument.category,
                compartments: createdServiceDocument.compartments,
                staffRolesCount: createdServiceDocument.staffRoles.length,
                assignedIndividualsCount: createdServiceDocument.assignedIndividuals.length,
                createdAt: createdServiceDocument.createdAt
            })

            // if(createdService.category.toLowerCase() === 'requested') {
                createdServiceDocument.compartments.forEach(compartment => {
                    addServiceIdToCompartment({
                        compartmentObjectId: compartment,
                        serviceObjectId: createdService.id
                    })
                    .catch((error)=> {
                        console.log('There was an error adding new requested service to compartment')
                        reject(error)
                    })
                })
            // }

            resolve(createdService)
        })
        .catch((error)=> reject(error))
    })
}