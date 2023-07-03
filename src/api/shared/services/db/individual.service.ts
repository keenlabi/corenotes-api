import { NotFoundError } from "@globals/server/Error";
import { IUser } from "@user/models/types";
import userModel from "@user/models/user.model";

export default function updateIndividualServicesById({individualId, serviceId, startDate}:{individualId:string, serviceId:string, startDate:string}) {
    return new Promise<IUser>((resolve, reject)=> {

        const query = { _id: individualId };

        const newService = {
            service: serviceId,
            startDate: startDate
        }
        const updateObj = { $push: { requestedServices: newService } }
    
        userModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedIndividual:IUser)=> {
            if(!updatedIndividual) {
                const notFoundError = new NotFoundError("Individual not found")
                reject(notFoundError);
            }
            resolve(updatedIndividual)
        })
        .catch((error)=> reject(error))
    })
}