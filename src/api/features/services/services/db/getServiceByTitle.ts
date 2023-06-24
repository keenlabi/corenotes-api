import serviceModel from "../../models/service.model"
import { IService } from "../../models/types"

export default function getServiceByTitle(serviceTitle:string) {
    return new Promise((resolve, reject)=> {

        const query = { title: serviceTitle.toLowerCase() }
        
        serviceModel.findOne(query)
        .then((foundService:IService)=> resolve(foundService))
        .catch((error)=> reject(error))
    })
}