export interface IAdministerMedicationTaskRequest {
    taskId:number;
    amountAdministered:number;
    amountLeft:number;
}

export default function validateAdministerMedicationTaskRequest(data:IAdministerMedicationTaskRequest) {
    return new Promise<IAdministerMedicationTaskRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.taskId) reject({ code:401, message:"Task id parameter must be provided" });

        resolve(data)
    })
}