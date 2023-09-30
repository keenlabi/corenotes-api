import serviceModel from "../../models/service.model"
import { IService } from "../../models/types"

export default function getServiceByServiceId(serviceId:number) {
    return new Promise<IService|null>((resolve, reject)=> {

        const query = { serviceId }
        
        serviceModel.findOne(query)
        .then((foundService)=> resolve(foundService))
        .catch((error)=> reject(error))
    })
}