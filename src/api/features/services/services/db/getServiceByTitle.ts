import serviceModel from "../../models/service.model"
import { IService } from "../../models/types"

export default function getServiceByTitle(serviceTitle:string) {
    return new Promise<IService|null>((resolve, reject)=> {

        const query = { title: serviceTitle.toLowerCase() }
        
        serviceModel.findOne(query)
        .then((foundService)=> resolve(foundService))
        .catch((error)=> reject(error))
    })
}