
export interface IAssignServiceToIndividualReqBody {
    serviceId:string;
    individualId:string;
    startDate:string;
}

export default function validateAssignIndividualServiceRequest(data:IAssignServiceToIndividualReqBody) {
    return new Promise<IAssignServiceToIndividualReqBody>((resolve, reject)=> {
        if(Object.keys(data).length === 0) reject({ code: 422, message:'Input fields cannot be empty' })

        if(!data.individualId) reject({ code: 422, message:'Service id cannot be empty' })

        if(!data.serviceId) reject({ code: 422, message:'Service id cannot be empty' })

        if(!data.startDate) reject({ code: 422, message:'Service start date cannot be empty' })
        
        const newData = Object.freeze({...data})

        resolve(newData)
    })
}