import serviceModel from "../../models/service.model"
import { IService } from "../../models/types"

export default function getServiceByServiceId(serviceId:number) {
    return new Promise<IService>((resolve, reject)=> {

        const query = { serviceId }
        
        serviceModel.findOne(query)
        .then((foundService:IService)=> resolve(foundService))
        .catch((error)=> reject(error))
    })
}