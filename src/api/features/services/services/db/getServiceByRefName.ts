import serviceModel from "../../models/service.model"
import { IService } from "../../models/types"

export default function getServiceByRefName(refName:string) {
    return new Promise<IService|null>((resolve, reject)=> {

        const query = { refName }
        
        serviceModel.findOne(query)
        .then((foundService:IService)=> resolve(foundService))
        .catch((error)=> reject(error))
    })
}