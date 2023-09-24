import { NotFoundError } from "@globals/server/Error";
import { getServiceByObjectId } from "src/api/shared/services/db/service.service";

export interface IAssignServiceToIndividualReqBody {
    serviceId:string;
    individualId:string;
    schedule: {
        startDate:string;
        time:string;
        frequency:string;
        frequencyAttr:number;
    }
}

export default function validateAssignIndividualServiceRequest(data:IAssignServiceToIndividualReqBody) {
    return new Promise<IAssignServiceToIndividualReqBody>((resolve, reject)=> {
        if(Object.keys(data).length === 0) reject({ code: 422, message:'Input fields cannot be empty' })

        if(!data.individualId) reject({ code: 422, message:'Individual id parameter cannot be empty' })

        if(!data.serviceId) reject({ code: 422, message:'Service id field cannot be empty' })

        getServiceByObjectId(data.serviceId)
        .then((foundService)=> {
            if(foundService) {
                const notFoundError = new NotFoundError('Service not found')
                reject(notFoundError)
            }

            if(foundService?.title.toLowerCase().split(' ').join('-') !== 'medication-administration') {
                if(!data.schedule.startDate) reject({ code: 422, message:'Service start date field cannot be empty' })

                if(!data.schedule.time) reject({ code: 422, message:'Service time field cannot be empty' })
        
                if(!data.schedule.frequency) reject({ code: 422, message:'Service frequency type field cannot be empty' })
        
                if(['every-x-days', 'every-x-weeks', 'every-x-days'].includes(data.schedule.frequency)) {
                    if(!data.schedule.frequencyAttr) reject({ code: 422, message:'Please select frequency value date field cannot be empty' })
                }
            }
        })
        
        const newData = Object.freeze({...data})

        resolve(newData)
    })
}