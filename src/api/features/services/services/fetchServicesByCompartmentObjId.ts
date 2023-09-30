import serviceModel from "../models/service.model";
import { IService } from "../models/types";

export default function fetchServicesByCompartmentObjId(compartmentId:number) {
    return new Promise<IService[]>((resolve, reject)=> {
        const query = { compartments: compartmentId };

        serviceModel.find(query)
        .sort({ createdAt: -1 })
        .then((foundServices)=> resolve(foundServices))
        .catch((error)=> reject(error))
    });
}