export interface ICreateServiceRequestBody {
    id:string,
    serviceId:number,
    title:string,
    compartments:Array<string>,
    staffRoles:Array<string>
    assignedIndividuals:Array<string>
}

export interface IServiceResponseFormat {
    id:string,
    serviceId:number,
    title:string,
    compartments:Array<string>,
    staffRoles:Array<string>,
    assignedIndividuals:Array<string>,
    createdAt:Date
}