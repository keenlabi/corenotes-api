import serviceModel from "src/api/features/services/models/service.model";
import { IService } from "src/api/features/services/models/types";

export function getServiceByObjectId(serviceObjectId:string){
    return new Promise<IService>((resolve, reject)=> {
        const query = { _id: serviceObjectId };

        serviceModel.findOne(query)
        .then((foundService)=> resolve(foundService))
        .catch((error)=> reject(error))
    })
}